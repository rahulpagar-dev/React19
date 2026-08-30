package api

import (
	"crypto/rand"
	"crypto/sha256"
	"database/sql"
	"encoding/hex"
	"encoding/json"
	"net/http"
	"strings"
	"time"
)

type AuthHandler struct {
	db *sql.DB
}

type authRequest struct {
	FullName          string `json:"fullName"`
	PhoneNumber       string `json:"phoneNumber"`
	VerificationToken string `json:"verificationToken"`
}

type userResponse struct {
	ID          string    `json:"id"`
	FullName    string    `json:"fullName"`
	PhoneNumber string    `json:"phoneNumber"`
	CreatedAt   time.Time `json:"createdAt"`
}

func NewAuthHandler(db *sql.DB) *AuthHandler {
	return &AuthHandler{db: db}
}

func (h *AuthHandler) CreateSession(w http.ResponseWriter, r *http.Request) {
	if h.db == nil {
		writeError(w, http.StatusServiceUnavailable, "database is not configured")
		return
	}

	var req authRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid request body")
		return
	}
	req.FullName = strings.TrimSpace(req.FullName)
	req.PhoneNumber = strings.TrimSpace(req.PhoneNumber)
	if req.PhoneNumber == "" || req.VerificationToken == "" {
		writeError(w, http.StatusBadRequest, "phone number and verification token are required")
		return
	}

	var user userResponse
	err := h.db.QueryRowContext(r.Context(), `
		INSERT INTO users (full_name, phone_number)
		VALUES ($1, $2)
		ON CONFLICT (phone_number) DO UPDATE SET
			full_name = CASE WHEN $1 <> '' THEN EXCLUDED.full_name ELSE users.full_name END,
			updated_at = now()
		RETURNING id, full_name, phone_number, created_at`, req.FullName, req.PhoneNumber).
		Scan(&user.ID, &user.FullName, &user.PhoneNumber, &user.CreatedAt)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "unable to save user")
		return
	}

	sessionToken, err := newSessionToken()
	if err != nil {
		writeError(w, http.StatusInternalServerError, "unable to create session")
		return
	}
	tokenHash := hashToken(sessionToken)
	_, err = h.db.ExecContext(r.Context(), `
		INSERT INTO sessions (user_id, token_hash, expires_at)
		VALUES ($1, $2, $3)`, user.ID, tokenHash, time.Now().UTC().Add(30*24*time.Hour))
	if err != nil {
		writeError(w, http.StatusInternalServerError, "unable to create session")
		return
	}

	h.setSessionCookie(w, sessionToken)
	writeJSON(w, http.StatusOK, user)
}

func (h *AuthHandler) Me(w http.ResponseWriter, r *http.Request) {
	user, ok := h.userFromRequest(r)
	if !ok {
		writeError(w, http.StatusUnauthorized, "authentication required")
		return
	}
	writeJSON(w, http.StatusOK, user)
}

func (h *AuthHandler) Logout(w http.ResponseWriter, r *http.Request) {
	if h.db != nil {
		if cookie, err := r.Cookie("asset_session"); err == nil {
			_, _ = h.db.ExecContext(r.Context(), `UPDATE sessions SET revoked_at = now() WHERE token_hash = $1`, hashToken(cookie.Value))
		}
	}
	http.SetCookie(w, expiredCookie())
	writeJSON(w, http.StatusOK, map[string]string{"status": "logged_out"})
}

func (h *AuthHandler) userFromRequest(r *http.Request) (userResponse, bool) {
	var user userResponse
	if h.db == nil {
		return user, false
	}
	cookie, err := r.Cookie("asset_session")
	if err != nil || cookie.Value == "" {
		return user, false
	}
	err = h.db.QueryRowContext(r.Context(), `
		SELECT u.id, u.full_name, u.phone_number, u.created_at
		FROM sessions s JOIN users u ON u.id = s.user_id
		WHERE s.token_hash = $1 AND s.revoked_at IS NULL AND s.expires_at > now()`, hashToken(cookie.Value)).
		Scan(&user.ID, &user.FullName, &user.PhoneNumber, &user.CreatedAt)
	return user, err == nil
}

func (h *AuthHandler) setSessionCookie(w http.ResponseWriter, value string) {
	http.SetCookie(w, &http.Cookie{Name: "asset_session", Value: value, Path: "/", HttpOnly: true, Secure: false, SameSite: http.SameSiteLaxMode, MaxAge: 30 * 24 * 60 * 60})
}

func newSessionToken() (string, error) {
	bytes := make([]byte, 32)
	if _, err := rand.Read(bytes); err != nil {
		return "", err
	}
	return hex.EncodeToString(bytes), nil
}

func hashToken(token string) string {
	hash := sha256.Sum256([]byte(token))
	return hex.EncodeToString(hash[:])
}

func expiredCookie() *http.Cookie {
	return &http.Cookie{Name: "asset_session", Value: "", Path: "/", HttpOnly: true, Secure: false, SameSite: http.SameSiteLaxMode, MaxAge: -1, Expires: time.Unix(1, 0)}
}

func writeJSON(w http.ResponseWriter, status int, value any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(value)
}

func writeError(w http.ResponseWriter, status int, message string) {
	writeJSON(w, status, map[string]string{"error": message})
}
