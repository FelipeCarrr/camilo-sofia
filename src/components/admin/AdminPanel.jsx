import { useEffect, useMemo, useState } from "react";

import {
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
} from "firebase/auth";

import {
    collection,
    deleteDoc,
    doc,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
    updateDoc,
} from "firebase/firestore";

import { auth, db } from "../../firebase/firebase";
import "./AdminPanel.css";

export default function AdminPanel() {
    const [user, setUser] = useState(null);
    const [checkingAuth, setCheckingAuth] = useState(true);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");
    const [loadingLogin, setLoadingLogin] = useState(false);

    const [guests, setGuests] = useState([]);
    const [loadingGuests, setLoadingGuests] = useState(false);
    const [guestError, setGuestError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [guestName, setGuestName] = useState("");
    const [guestType, setGuestType] = useState("individual");
    const [guestSlots, setGuestSlots] = useState(1);
    const [savingGuest, setSavingGuest] = useState(false);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("todos");
    const [typeFilter, setTypeFilter] = useState("todos");

    const [editingGuest, setEditingGuest] = useState(null);
    const [editName, setEditName] = useState("");
    const [editType, setEditType] = useState("individual");
    const [editSlots, setEditSlots] = useState(1);
    const [savingEdit, setSavingEdit] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setCheckingAuth(false);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (user) {
            loadGuests();
        }
    }, [user]);

    async function handleLogin(event) {
        event.preventDefault();

        setLoginError("");
        setLoadingLogin(true);

        try {
            await signInWithEmailAndPassword(auth, email.trim(), password);
        } catch (error) {
            console.error("Error iniciando sesión:", error);

            setLoginError(
                "No se pudo iniciar sesión. Verificá el correo y la contraseña."
            );
        } finally {
            setLoadingLogin(false);
        }
    }

    async function handleLogout() {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error cerrando sesión:", error);
        }
    }

    async function loadGuests() {
        setLoadingGuests(true);
        setGuestError("");

        try {
            const guestsQuery = query(
                collection(db, "invitados"),
                orderBy("createdAt", "desc")
            );

            const snapshot = await getDocs(guestsQuery);

            const guestsData = snapshot.docs.map((guestDoc) => ({
                id: guestDoc.id,
                ...guestDoc.data(),
            }));

            setGuests(guestsData);
        } catch (error) {
            console.error("Error cargando invitados:", error);

            setGuestError(
                "No se pudieron cargar los invitados. Revisá las reglas de Firestore."
            );
        } finally {
            setLoadingGuests(false);
        }
    }

    function generateToken() {
        return (
            crypto.randomUUID().replaceAll("-", "") +
            Math.random().toString(36).slice(2, 10)
        );
    }

    async function handleCreateGuest(event) {
        event.preventDefault();

        setGuestError("");
        setSuccessMessage("");

        const trimmedName = guestName.trim();
        const slots = Number(guestSlots);

        if (!trimmedName) {
            setGuestError("Ingresá el nombre del invitado o de la familia.");
            return;
        }

        if (!Number.isInteger(slots) || slots < 1) {
            setGuestError("La cantidad de cupos debe ser como mínimo 1.");
            return;
        }

        setSavingGuest(true);

        try {
            const token = generateToken();

            await setDoc(doc(db, "invitados", token), {
                nombre: trimmedName,
                tipo: guestType,
                cupos: slots,
                token,
                confirmacion: "pendiente",
                asistentesConfirmados: 0,
                createdAt: serverTimestamp(),
                createdBy: user.uid,
            });

            setGuestName("");
            setGuestType("individual");
            setGuestSlots(1);

            setSuccessMessage("Invitación registrada correctamente.");

            await loadGuests();
        } catch (error) {
            console.error("Error creando invitado:", error);

            setGuestError(
                "No se pudo registrar el invitado. Revisá las reglas de Firestore."
            );
        } finally {
            setSavingGuest(false);
        }
    }

    function startEditing(guest) {
        setEditingGuest(guest);
        setEditName(guest.nombre || "");
        setEditType(guest.tipo || "individual");
        setEditSlots(Number(guest.cupos) || 1);
        setGuestError("");
        setSuccessMessage("");
    }

    function cancelEditing() {
        setEditingGuest(null);
        setEditName("");
        setEditType("individual");
        setEditSlots(1);
    }

    async function handleSaveEdit(event) {
        event.preventDefault();

        if (!editingGuest) return;

        setGuestError("");
        setSuccessMessage("");

        const trimmedName = editName.trim();
        const slots = Number(editSlots);
        const alreadyConfirmed = Number(
            editingGuest.asistentesConfirmados || 0
        );

        if (!trimmedName) {
            setGuestError("Ingresá el nombre del invitado o de la familia.");
            return;
        }

        if (!Number.isInteger(slots) || slots < 1) {
            setGuestError("La cantidad de cupos debe ser como mínimo 1.");
            return;
        }

        if (slots < alreadyConfirmed) {
            setGuestError(
                `No podés asignar menos de ${alreadyConfirmed} cupos porque esa es la cantidad de asistentes confirmados.`
            );
            return;
        }

        setSavingEdit(true);

        try {
            await updateDoc(doc(db, "invitados", editingGuest.id), {
                nombre: trimmedName,
                tipo: editType,
                cupos: slots,
                updatedAt: serverTimestamp(),
            });

            setSuccessMessage("Invitación actualizada correctamente.");
            cancelEditing();
            await loadGuests();
        } catch (error) {
            console.error("Error actualizando invitado:", error);

            setGuestError(
                "No se pudo actualizar la invitación. Revisá las reglas de Firestore."
            );
        } finally {
            setSavingEdit(false);
        }
    }

    async function handleDeleteGuest(guestId) {
        const guest = guests.find((item) => item.id === guestId);

        const confirmed = window.confirm(
            `¿Estás seguro de que querés eliminar la invitación de "${guest?.nombre || "este invitado"}"? Esta acción no se puede deshacer.`
        );

        if (!confirmed) return;

        setGuestError("");
        setSuccessMessage("");

        try {
            await deleteDoc(doc(db, "invitados", guestId));

            setGuests((currentGuests) =>
                currentGuests.filter((item) => item.id !== guestId)
            );

            if (editingGuest?.id === guestId) {
                cancelEditing();
            }

            setSuccessMessage("Invitación eliminada correctamente.");
        } catch (error) {
            console.error("Error eliminando invitado:", error);

            setGuestError(
                "No se pudo eliminar la invitación. Revisá las reglas de Firestore."
            );
        }
    }

    function getInvitationLink(token) {
        return `${window.location.origin}/?invitacion=${encodeURIComponent(token)}`;
    }

    async function copyInvitationLink(token) {
        const link = getInvitationLink(token);

        try {
            await navigator.clipboard.writeText(link);
            setSuccessMessage("Enlace copiado al portapapeles.");
        } catch {
            window.prompt("Copiá este enlace:", link);
        }
    }

    const stats = useMemo(() => {
        const totalInvitations = guests.length;

        const totalSlots = guests.reduce(
            (total, guest) => total + Math.max(0, Number(guest.cupos) || 0),
            0
        );

        const confirmedInvitations = guests.filter(
            (guest) => guest.confirmacion === "confirmada"
        ).length;

        const declinedInvitations = guests.filter(
            (guest) => guest.confirmacion === "no_asistira"
        ).length;

        const pendingInvitations = guests.filter(
            (guest) =>
                !guest.confirmacion || guest.confirmacion === "pendiente"
        ).length;

        const confirmedPeople = guests.reduce((total, guest) => {
            if (guest.confirmacion !== "confirmada") return total;

            return total + Math.max(
                0,
                Number(guest.asistentesConfirmados) || 0
            );
        }, 0);

        const remainingSlots = guests.reduce((total, guest) => {
            const slots = Math.max(0, Number(guest.cupos) || 0);

            if (guest.confirmacion === "confirmada") {
                return total + Math.max(
                    0,
                    slots - (Number(guest.asistentesConfirmados) || 0)
                );
            }

            if (guest.confirmacion === "no_asistira") {
                return total;
            }

            return total + slots;
        }, 0);

        return {
            totalInvitations,
            totalSlots,
            confirmedInvitations,
            declinedInvitations,
            pendingInvitations,
            confirmedPeople,
            remainingSlots,
        };
    }, [guests]);

    const filteredGuests = useMemo(() => {
        const normalizedSearch = search.trim().toLocaleLowerCase("es");

        return guests.filter((guest) => {
            const nameMatches = (guest.nombre || "")
                .toLocaleLowerCase("es")
                .includes(normalizedSearch);

            const status = guest.confirmacion || "pendiente";
            const statusMatches =
                statusFilter === "todos" || status === statusFilter;

            const typeMatches =
                typeFilter === "todos" || guest.tipo === typeFilter;

            return nameMatches && statusMatches && typeMatches;
        });
    }, [guests, search, statusFilter, typeFilter]);

    function getStatusLabel(status) {
        if (status === "confirmada") return "Confirmada";
        if (status === "no_asistira") return "No asistirá";
        return "Pendiente";
    }

    function exportToExcel() {
        const headers = [
            "Nombre",
            "Tipo de invitación",
            "Cupos asignados",
            "Estado",
            "Asistentes confirmados",
            "Cupos sin confirmar",
            "Enlace personalizado",
        ];

        const rows = filteredGuests.map((guest) => {
            const slots = Math.max(0, Number(guest.cupos) || 0);
            const confirmed =
                guest.confirmacion === "confirmada"
                    ? Math.max(0, Number(guest.asistentesConfirmados) || 0)
                    : 0;

            const unconfirmed =
                guest.confirmacion === "pendiente" || !guest.confirmacion
                    ? slots
                    : guest.confirmacion === "confirmada"
                        ? Math.max(0, slots - confirmed)
                        : 0;

            return [
                guest.nombre || "",
                guest.tipo === "grupo" ? "Familia o grupo" : "Individual",
                slots,
                getStatusLabel(guest.confirmacion),
                confirmed,
                unconfirmed,
                getInvitationLink(guest.token),
            ];
        });

        const escapeCell = (value) =>
            `"${String(value ?? "").replaceAll('"', '""')}"`;

        const csvContent = [
            headers.map(escapeCell).join(";"),
            ...rows.map((row) => row.map(escapeCell).join(";")),
        ].join("\r\n");

        // BOM para facilitar la correcta lectura de caracteres especiales
        // en Excel. El archivo CSV puede abrirse directamente con Excel.
        const blob = new Blob(["\uFEFF" + csvContent], {
            type: "text/csv;charset=utf-8;",
        });

        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");

        anchor.href = url;
        anchor.download = "invitados-boda-camilo-y-sofia.csv";

        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();

        URL.revokeObjectURL(url);
    }

    if (checkingAuth) {
        return (
            <main className="admin-loading">
                <div className="admin-spinner" />
                <p>Comprobando acceso...</p>
            </main>
        );
    }

    if (!user) {
        return (
            <main className="admin-login-page">
                <section className="admin-login-card">
                    <div className="admin-login-monogram">C &amp; S</div>

                    <p className="admin-eyebrow">BODA · 24.10.2026</p>

                    <h1>Panel administrativo</h1>

                    <p className="admin-login-description">
                        Ingresá con tu cuenta para administrar las invitaciones
                        de Camilo y Sofía.
                    </p>

                    <form onSubmit={handleLogin} className="admin-form">
                        <label htmlFor="admin-email">Correo electrónico</label>

                        <input
                            id="admin-email"
                            type="email"
                            autoComplete="username"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="correo@ejemplo.com"
                            required
                        />

                        <label htmlFor="admin-password">Contraseña</label>

                        <input
                            id="admin-password"
                            type="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="Tu contraseña"
                            required
                        />

                        {loginError && (
                            <div className="admin-alert admin-alert-error">
                                {loginError}
                            </div>
                        )}

                        <button
                            className="admin-primary-button"
                            type="submit"
                            disabled={loadingLogin}
                        >
                            {loadingLogin ? "Ingresando..." : "Iniciar sesión"}
                        </button>
                    </form>

                    <a href="/" className="admin-back-link">
                        Volver a la invitación
                    </a>
                </section>
            </main>
        );
    }

    return (
        <main className="admin-dashboard">
            <header className="admin-header">
                <div>
                    <p className="admin-eyebrow">CAMILO &amp; SOFÍA · 24.10.2026</p>

                    <h1>Administración de invitados</h1>

                    <p className="admin-header-subtitle">
                        Gestioná las invitaciones y organizá cada detalle de
                        la asistencia.
                    </p>
                </div>

                <div className="admin-header-actions">
                    <a href="/" className="admin-secondary-button">
                        Ver invitación
                    </a>

                    <button
                        type="button"
                        className="admin-logout-button"
                        onClick={handleLogout}
                    >
                        Cerrar sesión
                    </button>
                </div>
            </header>

            {guestError && (
                <div className="admin-alert admin-alert-error admin-global-alert">
                    {guestError}
                </div>
            )}

            {successMessage && (
                <div className="admin-alert admin-alert-success admin-global-alert">
                    {successMessage}
                </div>
            )}

            <section className="admin-stats">
                <article className="admin-stat-card">
                    <span>Invitaciones registradas</span>
                    <strong>{stats.totalInvitations}</strong>
                    <small>Personas, familias o grupos</small>
                </article>

                <article className="admin-stat-card">
                    <span>Cupos asignados</span>
                    <strong>{stats.totalSlots}</strong>
                    <small>Total de lugares reservados</small>
                </article>

                <article className="admin-stat-card admin-stat-confirmed">
                    <span>Personas confirmadas</span>
                    <strong>{stats.confirmedPeople}</strong>
                    <small>{stats.confirmedInvitations} invitaciones confirmadas</small>
                </article>

                <article className="admin-stat-card admin-stat-pending">
                    <span>Invitaciones pendientes</span>
                    <strong>{stats.pendingInvitations}</strong>
                    <small>Esperando respuesta</small>
                </article>

                <article className="admin-stat-card admin-stat-declined">
                    <span>Invitaciones rechazadas</span>
                    <strong>{stats.declinedInvitations}</strong>
                    <small>Indicaron que no asistirán</small>
                </article>

                <article className="admin-stat-card">
                    <span>Cupos sin confirmar</span>
                    <strong>{stats.remainingSlots}</strong>
                    <small>Cupos pendientes o aún disponibles</small>
                </article>
            </section>

            <section className="admin-content-grid">
                <article className="admin-panel-card">
                    <div className="admin-section-heading">
                        <p className="admin-eyebrow">NUEVA INVITACIÓN</p>
                        <h2>Registrar invitados</h2>
                        <p>
                            Creá una invitación individual o para una familia
                            o grupo.
                        </p>
                    </div>

                    <form onSubmit={handleCreateGuest} className="admin-form">
                        <label htmlFor="guest-name">
                            Nombre del invitado o familia
                        </label>

                        <input
                            id="guest-name"
                            type="text"
                            value={guestName}
                            onChange={(event) => setGuestName(event.target.value)}
                            placeholder="Ej. Juan Pérez o Familia Pérez"
                            required
                        />

                        <label htmlFor="guest-type">Tipo de invitación</label>

                        <select
                            id="guest-type"
                            value={guestType}
                            onChange={(event) => setGuestType(event.target.value)}
                        >
                            <option value="individual">Individual</option>
                            <option value="grupo">Familia o grupo</option>
                        </select>

                        <label htmlFor="guest-slots">Cantidad de cupos</label>

                        <input
                            id="guest-slots"
                            type="number"
                            min="1"
                            step="1"
                            value={guestSlots}
                            onChange={(event) => setGuestSlots(event.target.value)}
                            required
                        />

                        <button
                            type="submit"
                            className="admin-primary-button"
                            disabled={savingGuest}
                        >
                            {savingGuest
                                ? "Guardando..."
                                : "Registrar invitación"}
                        </button>
                    </form>
                </article>

                <article className="admin-panel-card admin-guests-card">
                    <div className="admin-section-heading admin-guests-heading">
                        <div>
                            <p className="admin-eyebrow">LISTADO</p>
                            <h2>Invitados registrados</h2>
                            <p>
                                Mostrando {filteredGuests.length} de {guests.length} invitaciones.
                            </p>
                        </div>

                        <div className="admin-list-actions">
                            <button
                                type="button"
                                className="admin-refresh-button"
                                onClick={loadGuests}
                                disabled={loadingGuests}
                            >
                                {loadingGuests ? "Cargando..." : "Actualizar"}
                            </button>

                            <button
                                type="button"
                                className="admin-export-button"
                                onClick={exportToExcel}
                                disabled={filteredGuests.length === 0}
                            >
                                Exportar a Excel
                            </button>
                        </div>
                    </div>

                    <div className="admin-filters">
                        <div className="admin-search-wrap">
                            <label htmlFor="guest-search">Buscar por nombre</label>

                            <input
                                id="guest-search"
                                type="search"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Escribí un nombre..."
                            />
                        </div>

                        <div>
                            <label htmlFor="status-filter">Estado</label>

                            <select
                                id="status-filter"
                                value={statusFilter}
                                onChange={(event) => setStatusFilter(event.target.value)}
                            >
                                <option value="todos">Todos los estados</option>
                                <option value="pendiente">Pendientes</option>
                                <option value="confirmada">Confirmadas</option>
                                <option value="no_asistira">No asistirán</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="type-filter">Tipo</label>

                            <select
                                id="type-filter"
                                value={typeFilter}
                                onChange={(event) => setTypeFilter(event.target.value)}
                            >
                                <option value="todos">Todos los tipos</option>
                                <option value="individual">Individuales</option>
                                <option value="grupo">Familias o grupos</option>
                            </select>
                        </div>
                    </div>

                    {loadingGuests ? (
                        <div className="admin-empty-message">
                            <div className="admin-spinner" />
                            <p>Cargando invitados...</p>
                        </div>
                    ) : filteredGuests.length === 0 ? (
                        <div className="admin-empty-message">
                            <h3>No hay resultados</h3>
                            <p>
                                No encontramos invitaciones que coincidan con
                                la búsqueda y los filtros seleccionados.
                            </p>
                        </div>
                    ) : (
                        <div className="admin-guest-list">
                            {filteredGuests.map((guest) => {
                                const status = guest.confirmacion || "pendiente";
                                const slots = Number(guest.cupos) || 0;
                                const confirmed =
                                    status === "confirmada"
                                        ? Number(guest.asistentesConfirmados) || 0
                                        : 0;

                                return (
                                    <div className="admin-guest-item" key={guest.id}>
                                        <div className="admin-guest-info">
                                            <div className="admin-guest-title-row">
                                                <h3>{guest.nombre}</h3>

                                                <span
                                                    className={`admin-status admin-status-${status}`}
                                                >
                                                    {getStatusLabel(status)}
                                                </span>
                                            </div>

                                            <p className="admin-guest-meta">
                                                {guest.tipo === "grupo"
                                                    ? "Familia o grupo"
                                                    : "Individual"}
                                                {" · "}
                                                {slots} {slots === 1 ? "cupo" : "cupos"}
                                            </p>

                                            <div className="admin-guest-attendance">
                                                <span>
                                                    Confirmados: <strong>{confirmed}</strong>
                                                </span>

                                                <span>
                                                    {status === "no_asistira"
                                                        ? "Sin asistencia"
                                                        : `Cupos restantes: ${Math.max(0, slots - confirmed)}`}
                                                </span>
                                            </div>

                                            <div className="admin-guest-actions">
                                                <button
                                                    type="button"
                                                    className="admin-link-button"
                                                    onClick={() => copyInvitationLink(guest.token)}
                                                >
                                                    Copiar enlace
                                                </button>

                                                <button
                                                    type="button"
                                                    className="admin-edit-button"
                                                    onClick={() => startEditing(guest)}
                                                >
                                                    Editar
                                                </button>

                                                <button
                                                    type="button"
                                                    className="admin-delete-button"
                                                    onClick={() => handleDeleteGuest(guest.id)}
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </article>
            </section>

            {editingGuest && (
                <div
                    className="admin-modal-backdrop"
                    role="presentation"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            cancelEditing();
                        }
                    }}
                >
                    <section
                        className="admin-edit-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="edit-guest-title"
                    >
                        <div className="admin-section-heading">
                            <p className="admin-eyebrow">EDITAR INVITACIÓN</p>
                            <h2 id="edit-guest-title">Modificar invitado</h2>
                            <p>
                                Actualizá los datos de esta invitación. El enlace
                                personalizado se conservará.
                            </p>
                        </div>

                        <form onSubmit={handleSaveEdit} className="admin-form">
                            <label htmlFor="edit-guest-name">
                                Nombre del invitado o familia
                            </label>

                            <input
                                id="edit-guest-name"
                                type="text"
                                value={editName}
                                onChange={(event) => setEditName(event.target.value)}
                                required
                            />

                            <label htmlFor="edit-guest-type">
                                Tipo de invitación
                            </label>

                            <select
                                id="edit-guest-type"
                                value={editType}
                                onChange={(event) => setEditType(event.target.value)}
                            >
                                <option value="individual">Individual</option>
                                <option value="grupo">Familia o grupo</option>
                            </select>

                            <label htmlFor="edit-guest-slots">
                                Cantidad de cupos
                            </label>

                            <input
                                id="edit-guest-slots"
                                type="number"
                                min={Math.max(
                                    1,
                                    Number(editingGuest.asistentesConfirmados) || 1
                                )}
                                step="1"
                                value={editSlots}
                                onChange={(event) => setEditSlots(event.target.value)}
                                required
                            />

                            <div className="admin-modal-actions">
                                <button
                                    type="button"
                                    className="admin-secondary-button"
                                    onClick={cancelEditing}
                                    disabled={savingEdit}
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    className="admin-primary-button"
                                    disabled={savingEdit}
                                >
                                    {savingEdit ? "Guardando..." : "Guardar cambios"}
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            )}

            <footer className="admin-footer">
                Panel privado · Camilo &amp; Sofía
            </footer>
        </main>
    );
}