(function () {
  'use strict';

  var config = window.STORE_CONFIG || {};
  var sb = (config && config.supabase) || null;
  var db = null;
  if (sb && window.supabase && typeof window.supabase.createClient === 'function') {
    db = window.supabase.createClient(sb.url, sb.key);
  }

  var els = {
    panel: document.getElementById('panel-shell'),
    login: document.getElementById('login-shell'),
    loginForm: document.getElementById('login-form'),
    loginEmail: document.getElementById('login-email'),
    loginPassword: document.getElementById('login-password'),
    loginError: document.getElementById('login-error'),
    loginOk: document.getElementById('login-ok'),
    btnLogin: document.getElementById('btn-login'),
    btnSignup: document.getElementById('btn-signup'),
    btnLogout: document.getElementById('btn-logout'),
    btnRefresh: document.getElementById('btn-refresh'),
    btnNewProduct: document.getElementById('btn-new-product'),
    btnImportDemo: document.getElementById('btn-import-demo'),
    adminEmail: document.getElementById('admin-email'),
    search: document.getElementById('admin-search'),
    summary: document.getElementById('admin-summary'),
    banner: document.getElementById('admin-banner'),
    list: document.getElementById('admin-list'),
    empty: document.getElementById('admin-empty'),
    loading: document.getElementById('admin-loading'),
    dialog: document.getElementById('editor-dialog'),
    editorBody: document.getElementById('editor-body'),
    editorTitle: document.getElementById('editor-title'),
    editorKicker: document.getElementById('editor-kicker'),
    editorError: document.getElementById('editor-error'),
    editorSave: document.getElementById('editor-save'),
    editorCancel: document.getElementById('editor-cancel'),
    editorClose: document.getElementById('editor-close'),
    toast: document.getElementById('admin-toast')
  };

  var state = {
    email: '',
    rows: [],
    editing: null,
    isNew: false,
    photoPickedPath: '',
    oldPhotoPath: '',
    currentAdmin: false
  };

  var toastTimer = null;
  function showToast(message, kind) {
    if (!els.toast) return;
    els.toast.textContent = message;
    els.toast.className = 'admin-toast is-visible' + (kind ? ' is-' + kind : '');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      els.toast.classList.remove('is-visible');
    }, 3400);
  }

  function showBanner(message, kind) {
    if (!els.banner) return;
    if (!message) { els.banner.hidden = true; return; }
    els.banner.textContent = message;
    els.banner.className = 'admin-banner is-' + (kind || 'error');
    els.banner.hidden = false;
  }

  function cleanError(error, fallback) {
    var msg = (error && error.message) || fallback || 'Algo salió mal.';
    var known = {
      'Invalid login credentials': 'Correo o contraseña incorrecta.',
      'Email not confirmed': 'Tu correo aún no está confirmado: revisa tu bandeja y confirma para entrar.',
      'User already registered': 'Ese correo ya tiene cuenta: usa “Ingresar”.',
      'Password should be at least 6 characters': 'La contraseña necesita al menos 6 caracteres.'
    };
    if (known[msg]) return known[msg];
    if (error && error.code === '23505') return 'El enlace (slug) ya existe: usa otro distinto.';
    if (error && error.code === '42501') return 'Tu correo no tiene permisos de administrador (tabla tienda_admin).';
    return msg;
  }

  function slugify(value) {
    return String(value || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-+|-+$)/g, '')
      .slice(0, 60);
  }

  /* ===================== AUTENTICACIÓN ===================== */

  function switchView(panel) {
    els.login.hidden = panel !== 'login';
    els.panel.hidden = panel !== 'panel';
  }

  async function ensureNoAccess(message) {
    await db.auth.signOut();
    switchView('login');
    els.loginError.textContent = message;
    els.loginError.hidden = false;
    state.currentAdmin = false;
  }

  async function isAuthorized(email) {
    if (!email) return false;
    const res = await db
      .from('tienda_admin')
      .select('email')
      .eq('email', String(email).toLowerCase());
    if (res.error) {
      window.console && console.warn('tienda_admin check:', res.error.message);
      return false;
    }
    return Array.isArray(res.data) && res.data.length > 0;
  }

  async function enterPanel(silent) {
    const { data } = await db.auth.getUser();
    const email = (data && data.user && data.user.email) || '';
    state.email = email;
    state.currentAdmin = await isAuthorized(email);
    if (!state.currentAdmin) {
      await ensureNoAccess('Tu correo (' + email + ') no está en la lista de administradores. Ejecuta/agrega tu correo en la tabla tienda_admin (ver supabase-setup.sql).');
      return;
    }
    if (els.adminEmail) els.adminEmail.textContent = email;
    switchView('panel');
    showBanner('');
    await loadProducts(silent === true);
  }

  async function handleLogin(event) {
    event.preventDefault();
    if (!db) {
      els.loginError.textContent = 'Supabase no cargó (revisa tu conexión a internet).';
      els.loginError.hidden = false;
      return;
    }
    const email = els.loginEmail.value.trim();
    const password = els.loginPassword.value;
    if (!email || !password) {
      els.loginError.textContent = 'Escribe tu correo y tu contraseña.';
      els.loginError.hidden = false;
      return;
    }
    if (!els.loginOk.hidden) els.loginOk.hidden = true;
    els.btnLogin.disabled = true;
    try {
      const { error } = await db.auth.signInWithPassword({ email: email, password: password });
      if (error) throw error;
      els.loginPassword.value = '';
      await enterPanel();
    } catch (e) {
      els.loginError.textContent = cleanError(e, 'No se pudo ingresar.');
      els.loginError.hidden = false;
    } finally {
      els.btnLogin.disabled = false;
    }
  }

  async function handleSignup() {
    if (!db) {
      els.loginError.textContent = 'Supabase no cargó (revisa tu conexión a internet).';
      els.loginError.hidden = false;
      return;
    }
    const email = els.loginEmail.value.trim();
    const password = els.loginPassword.value;
    if (!email || password.length < 6) {
      els.loginError.textContent = 'Escribe tu correo y una contraseña de al menos 6 caracteres.';
      els.loginError.hidden = false;
      return;
    }
    els.loginError.hidden = true;
    els.btnSignup.disabled = true;
    try {
      const { data, error } = await db.auth.signUp({ email: email, password: password });
      if (error) throw error;
      if (data && data.session) {
        await enterPanel();
      } else {
        els.loginError.hidden = true;
        els.loginOk.textContent = 'Cuenta creada. Si Supabase pide confirmación, revisa tu correo y confirma; después vuelve aquí y presiona Ingresar.';
        els.loginOk.hidden = false;
      }
    } catch (e) {
      els.loginError.textContent = cleanError(e, 'No se pudo crear la cuenta.');
      els.loginError.hidden = false;
    } finally {
      els.btnSignup.disabled = false;
    }
  }

  async function handleLogout() {
    if (db) await db.auth.signOut();
    state.rows = [];
    state.currentAdmin = false;
    switchView('login');
    els.loginError.hidden = true;
    els.loginOk.hidden = true;
  }

  /* ===================== ARTES MINIATURA ===================== */

  function miniArt(palette) {
    const c1 = palette && palette[0] ? palette[0] : '#743142';
    const c2 = palette && palette[1] ? palette[1] : '#d58f80';
    const c3 = palette && palette[2] ? palette[2] : '#f5ddd1';
    return (
      '<svg viewBox="0 0 88 66" aria-hidden="true">' +
      '<rect width="88" height="66" fill="' + c3 + '"/>' +
      '<rect width="88" height="66" fill="' + c2 + '" opacity="0.25"/>' +
      '<path d="M44 56s-14-8.4-14-17.8C30 32 34.4 28 39.2 28c1.9 0 3.4.6 4.8 1.7 1.4-1.1 2.9-1.7 4.8-1.7C53.6 28 58 32 58 38.2 58 47.6 44 56 44 56Z" fill="' + c1 + '"/>' +
      '</svg>'
    );
  }

  function rowThumb(row) {
    if (row.photo_url) return '<img src="' + escapeHTML(row.photo_url) + '" alt="" loading="lazy">';
    return miniArt(row.palette);
  }

  function escapeHTML(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function money(value) {
    try {
      return new Intl.NumberFormat(config.locale || 'es-BO', {
        style: 'currency',
        currency: config.currency || 'BOB',
        maximumFractionDigits: 0
      }).format(value || 0);
    } catch (e) {
      return ('Bs ' + (value || 0));
    }
  }

  function categoryLabel(id) {
    const cats = window.STORE_CATEGORIES || [];
    const found = cats.filter(function (c) { return c.id === id; })[0];
    return found ? found.label : id;
  }

  /* ===================== LISTA ===================== */

  async function loadProducts(silent) {
    if (!db) return;
    if (!silent) {
      els.loading.hidden = false;
      els.empty.hidden = true;
      showBanner('');
    }
    const res = await db
      .from('tienda_products')
      .select('*')
      .order('sort', { ascending: true })
      .order('featured', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: false });
    els.loading.hidden = true;
    if (res.error) {
      showBanner('No se pudo cargar el catálogo: ' + cleanError(res.error, 'error de base de datos') + '. ¿Ya ejecutaste supabase-setup.sql?');
      state.rows = [];
      renderList();
      return;
    }
    state.rows = res.data || [];
    renderList();
  }

  function filteredRows() {
    const q = (els.search && els.search.value || '').trim().toLowerCase();
    if (!q) return state.rows;
    return state.rows.filter(function (row) {
      return String(row.name + ' ' + row.slug + ' ' + row.category).toLowerCase().indexOf(q) !== -1;
    });
  }

  function renderList() {
    const rows = filteredRows();
    els.list.innerHTML = rows.map(function (row) {
      const published = row.published;
      const featured = row.featured == null ? '' : '#' + row.featured;
      return (
        '<article class="admin-row" data-row-id="' + row.id + '">' +
        '<div class="admin-row-thumb" aria-hidden="true">' + rowThumb(row) + '</div>' +
        '<div class="admin-row-info">' +
        '<p class="admin-row-name"><a href="index.html#producto/' + escapeHTML(row.slug) + '" target="_blank" rel="noopener">' + escapeHTML(row.name) + '</a></p>' +
        '<div class="admin-row-features">' +
        '<span class="admin-pill">' + escapeHTML(categoryLabel(row.category)) + '</span>' +
        (row.badge ? '<span class="admin-pill">' + escapeHTML(row.badge) + '</span>' : '') +
        (featured ? '<span class="admin-pill">Estrella ' + featured + '</span>' : '') +
        '</div></div>' +
        '<div class="admin-row-meta">' +
        '<strong>' + money(row.price) + '</strong><br>' +
        '<label class="admin-switch" data-toggle="' + row.id + '">' +
        '<input type="checkbox" data-toggle-input="' + row.id + '"' + (published ? ' checked' : '') + '>' +
        '<span>' + (published ? 'Publicado' : 'Oculto') + '</span>' +
        '</label>' +
        '</div>' +
        '<div class="admin-row-actions">' +
        '<button class="btn btn-ghost btn-sm" type="button" data-edit="' + row.id + '">Editar</button>' +
        '<button class="btn btn-danger btn-sm" type="button" data-delete="' + row.id + '">Eliminar</button>' +
        '</div>' +
        '</article>'
      );
    }).join('');
    els.empty.hidden = rows.length !== 0;
    if (els.summary) {
      const total = state.rows.length;
      const live = state.rows.filter(function (row) { return row.published; }).length;
      const photos = state.rows.filter(function (row) { return !!row.photo_url; }).length;
      els.summary.textContent = total + ' producto' + (total === 1 ? '' : 's') + ' · ' + live + ' publicados · ' + photos + ' con foto.';
    }
  }

  /* ===================== IMPORTAR DEMO ===================== */

  function seedToRows() {
    const seed = window.PRODUCTS || [];
    return seed.map(function (p, index) {
      return {
        slug: p.id,
        name: p.name,
        category: p.category,
        lead: p.lead || '',
        description: p.description || '',
        price: p.price || 0,
        badge: p.badge || '',
        featured: p.featured == null ? null : p.featured,
        palette: p.palette || ['#743142', '#d58f80', '#f5ddd1', '#c7a05b'],
        options: p.options || [],
        fields: p.fields || [],
        includes: p.includes || [],
        delivery: p.delivery || '',
        tags: p.tags || '',
        photo_url: '',
        photo_path: '',
        published: true,
        sort: 10 + index * 10
      };
    });
  }

  async function importDemo() {
    if (!db) return;
    els.btnImportDemo.disabled = true;
    try {
      const existing = await db.from('tienda_products').select('slug');
      const have = {};
      ((existing && existing.data) || []).forEach(function (row) {
        have[row.slug] = true;
      });
      const rows = seedToRows().filter(function (row) { return !have[row.slug]; });
      if (!rows.length) {
        showToast('Los 10 ejemplos ya están en la base.', 'ok');
        return;
      }
      const ins = await db.from('tienda_products').insert(rows);
      if (ins.error) throw ins.error;
      showToast('Importados ' + (ins.data || []).length + ' productos de ejemplo.', 'ok');
      await loadProducts(true);
    } catch (e) {
      showBanner('No se pudo importar: ' + cleanError(e, 'error de base de datos'));
    } finally {
      els.btnImportDemo.disabled = false;
    }
  }

  /* ===================== EDITOR ===================== */

  function blankRow() {
    return {
      id: null,
      slug: '',
      name: '',
      category: (window.STORE_CATEGORIES && window.STORE_CATEGORIES[1] && window.STORE_CATEGORIES[1].id) || 'cajitas',
      lead: '',
      description: '',
      price: 99,
      badge: '',
      featured: null,
      palette: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
      options: [],
      fields: [],
      includes: [],
      delivery: '',
      tags: '',
      photo_url: '',
      photo_path: '',
      published: true,
      sort: 100
    };
  }

  function openEditor(row, isNew) {
    state.editing = JSON.parse(JSON.stringify(row));
    state.isNew = !!isNew;
    state.photoPickedPath = '';
    state.oldPhotoPath = isNew ? '' : (row.photo_path || '');

    els.editorKicker.textContent = isNew ? 'Producto nuevo' : 'Editar producto';
    els.editorTitle.textContent = isNew ? 'Nuevo producto' : row.name;
    els.editorError.hidden = true;
    renderEditor();
    if (typeof els.dialog.showModal === 'function') els.dialog.showModal();
    else els.dialog.setAttribute('open', '');
  }

  function closeEditor(cancel) {
    if (cancel && state.photoPickedPath) {
      try { db.storage.from(sb.bucket).remove([state.photoPickedPath]); } catch (e) { /* sin-op */ }
      state.photoPickedPath = '';
    }
    if (els.dialog.open) els.dialog.close();
    else els.dialog.removeAttribute('open');
    state.editing = null;
  }

  /* ---------- render del cuerpo del editor ---------- */

  const OPTION_TYPES = ['text', 'textarea', 'date', 'url', 'tel', 'number'];

  function renderEditor() {
    const row = state.editing;
    const palette = row.palette && row.palette.length === 4 ? row.palette : ['#743142', '#d58f80', '#f5ddd1', '#c7a05b'];
    els.editorBody.innerHTML =
      '<div class="admin-editor">' +

      '<fieldset><legend>General</legend><div class="admin-grid-2">' +
      '<label class="admin-field"><span>Nombre del producto *</span><input data-f="name" type="text" maxlength="70" value="' + escapeHTML(row.name) + '"></label>' +
      '<label class="admin-field"><span>Enlace (slug) *</span><input data-f="slug" type="text" maxlength="60" value="' + escapeHTML(row.slug) + '"><p class="admin-hint">Se genera del nombre. Se usa en el enlace de la ficha.</p></label>' +
      '<label class="admin-field"><span>Categoría</span><select data-f="category">' +
      (window.STORE_CATEGORIES || []).filter(function (c) { return c.id !== 'todos'; }).map(function (c) {
        return '<option value="' + c.id + '"' + (row.category === c.id ? ' selected' : '') + '>' + escapeHTML(c.label) + '</option>';
      }).join('') +
      '</select></label>' +
      '<label class="admin-field"><span>Precio base Bs *</span><input data-f="price" type="number" min="0" step="1" value="' + (row.price || 0) + '"></label>' +
      '<label class="admin-field"><span>Etiqueta (badge)</span><input data-f="badge" type="text" maxlength="24" value="' + escapeHTML(row.badge) + '"></label>' +
      '<label class="admin-field"><span>Estrella (orden destacado)</span><input data-f="featured" type="number" min="0" step="1" value="' + (row.featured == null ? '' : row.featured) + '" placeholder="Vacío = sin destello"></label>' +
      '<label class="admin-field"><span>Orden en catálogo</span><input data-f="sort" type="number" step="1" value="' + (row.sort == null ? 100 : row.sort) + '"></label>' +
      '<label class="admin-field admin-switch"><input data-f="published" type="checkbox"' + (row.published ? ' checked' : '') + '><span>Publicado en la tienda</span></label>' +
      '</div></fieldset>' +

      '<fieldset><legend>Textos</legend><div class="admin-grid-2">' +
      '<label class="admin-field admin-field-wide"><span>Frase corta (lead)</span><input data-f="lead" type="text" maxlength="90" value="' + escapeHTML(row.lead) + '"></label>' +
      '<label class="admin-field admin-field-wide"><span>Descripción</span><textarea data-f="description" rows="3" maxlength="400">' + escapeHTML(row.description) + '</textarea></label>' +
      '<label class="admin-field admin-field-wide"><span>Incluye (una línea por item)</span><textarea data-f="includes" rows="4">' + escapeHTML((row.includes || []).join('\n')) + '</textarea></label>' +
      '<label class="admin-field"><span>Tiempo de entrega</span><input data-f="delivery" type="text" maxlength="70" value="' + escapeHTML(row.delivery) + '"></label>' +
      '<label class="admin-field"><span>Palabras para búsqueda</span><input data-f="tags" type="text" maxlength="120" value="' + escapeHTML(row.tags) + '"></label>' +
      '</div></fieldset>' +

      '<fieldset><legend>Colores de la ilustración</legend><div class="admin-grid-4">' +
      '<label class="admin-field"><span>Color 1</span><input data-p="0" type="color" value="' + escapeHTML(palette[0]).replace('&#39;', '') + '"></label>' +
      '<label class="admin-field"><span>Color 2</span><input data-p="1" type="color" value="' + escapeHTML(palette[1]).replace('&#39;', '') + '"></label>' +
      '<label class="admin-field"><span>Color fondo</span><input data-p="2" type="color" value="' + escapeHTML(palette[2]).replace('&#39;', '') + '"></label>' +
      '<label class="admin-field"><span>Color detalle</span><input data-p="3" type="color" value="' + escapeHTML(palette[3]).replace('&#39;', '') + '"></label>' +
      '</div><p class="admin-hint">Solo se usan si el producto no tiene foto: generan la ilustración decorativa.</p></fieldset>' +

      '<fieldset><legend>Foto del producto</legend><div class="editor-photo">' +
      photoPreviewHTML(row) +
      '<div class="editor-photo-controls">' +
      '<label class="btn btn-secondary btn-sm"><input type="file" id="photo-file" accept="image/*" hidden>Seleccionar foto…</label>' +
      (row.photo_url ? '<button class="btn btn-ghost btn-sm" type="button" id="photo-remove">Quitar foto</button>' : '') +
      '<p class="inline-note">La foto se sube a la nube de Supabase. Recomendado: cuadrada, ancho 1200px, hasta 5 MB.</p>' +
      (state.photoPickedPath ? '<p class="admin-hint">Foto seleccionada: se guardará al presionar Guardar.</p>' : '') +
      '</div></div></fieldset>' +

      '<fieldset><legend>Opciones (pills con recargo)</legend>' +
      '<div id="options-list">' + renderOptionsHTML(row) + '</div>' +
      '<button class="btn btn-secondary btn-sm" type="button" id="add-option">+ Agregar opción</button>' +
      '</fieldset>' +

      '<fieldset><legend>Campos de personalización</legend>' +
      '<div id="fields-list">' + renderFieldsHTML(row) + '</div>' +
      '<button class="btn btn-secondary btn-sm" type="button" id="add-field">+ Agregar campo</button>' +
      '</fieldset>' +

      '</div>';
  }

  function photoPreviewHTML(row) {
    if (row.photo_url) {
      return '<img class="editor-photo-preview" src="' + escapeHTML(row.photo_url) + '" alt="Foto del producto">';
    }
    return '<div class="editor-photo-preview is-empty">Sin foto (se muestra la ilustración)</div>';
  }

  function renderOptionsHTML(row) {
    return (row.options || []).map(function (option, i) {
      const values = (option.values || []).map(function (value, j) {
        return (
          '<div class="admin-repeater-row">' +
          '<span class="row-label">Opción</span>' +
          '<input type="text" data-opt="' + i + '" data-choice="' + j + '" data-cf="label" maxlength="40" value="' + escapeHTML(value.label) + '">' +
          '<input type="number" data-opt="' + i + '" data-choice="' + j + '" data-cf="price" min="0" step="100" value="' + (value.price || 0) + '">' +
          '<button class="btn btn-danger btn-sm" type="button" data-remove-choice="' + i + ':' + j + '">×</button>' +
          '</div>'
        );
      }).join('');
      return (
        '<div class="admin-option-block" data-block="' + i + '">' +
        '<div class="admin-repeater-row">' +
        '<label class="admin-field"><span>Nombre del grupo</span><input type="text" data-opt="' + i + '" data-of="label" maxlength="30" value="' + escapeHTML(option.label) + '"><p class="admin-hint">Key interna: <span class="code">' + escapeHTML(option.name || slugify(option.label)) + '</span></p></label>' +
        '<span></span>' +
        '<button class="btn btn-danger btn-sm" type="button" data-remove-option="' + i + '">Eliminar grupo</button>' +
        '</div>' +
        values +
        '<button class="btn btn-ghost btn-sm" type="button" data-add-choice="' + i + '">+ alternativa</button>' +
        '</div>'
      );
    }).join('');
  }

  function renderFieldsHTML(row) {
    return (row.fields || []).map(function (field, i) {
      return (
        '<div class="admin-repeater-row admin-grid-2" style="display:grid; gap:8px;">' +
        '<div class="admin-grid-4" style="grid-column: 1 / -1; gap:8px;">' +
        '<label class="admin-field"><span>Etiqueta</span><input type="text" data-field="' + i + '" data-ff="label" maxlength="50" value="' + escapeHTML(field.label) + '"></label>' +
        '<label class="admin-field"><span>Tipo</span><select data-field="' + i + '" data-ff="type">' +
        OPTION_TYPES.map(function (t) {
          return '<option value="' + t + '"' + ((field.type || 'text') === t ? ' selected' : '') + '>' + t + '</option>';
        }).join('') +
        '</select></label>' +
        '<label class="admin-field"><span>Requerido</span><select data-field="' + i + '" data-ff="required">' +
        '<option value="no"' + (!field.required ? ' selected' : '') + '>No</option>' +
        '<option value="si"' + (field.required ? ' selected' : '') + '>Sí</option>' +
        '</select></label>' +
        '<label class="admin-field"><span>Longitud máx.</span><input type="number" data-field="' + i + '" data-ff="maxlength" min="1" max="500" value="' + (field.maxlength || '') + '"></label>' +
        '<label class="admin-field;"><span>Ejemplo (placeholder)</span><input type="text" data-field="' + i + '" data-ff="placeholder" maxlength="80" value="' + escapeHTML(field.placeholder || '') + '"></label>' +
        '</div>' +
        '<button class="btn btn-danger btn-sm" type="button" data-remove-field="' + i + '" style="margin-bottom:auto;">×</button>' +
        '</div>'
      );
    }).join('');
  }

  function onEditorChange(event) {
    const el = event.target;
    if (el && el.id === 'photo-file') {
      const file = el.files && el.files[0];
      if (file) uploadPhoto(file);
      el.value = '';
      return;
    }
    if (el && el.matches && el.matches('select[data-ff="required"]')) {
      const i = Number(el.dataset.field);
      state.editing.fields[i].required = el.value === 'si';
      return;
    }
    if (el && el.matches && el.matches('select[data-ff="type"]')) {
      const i = Number(el.dataset.field);
      state.editing.fields[i].type = el.value;
    }
  }

  async function uploadPhoto(file) {
    if (!file.type || file.type.indexOf('image/') !== 0) {
      showToast('Ese archivo no es una imagen.', 'err');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('La imagen pesa más de 5 MB; usa una más liviana.', 'err');
      return;
    }
    const editing = state.editing || {};
    const slug = editing.slug ? slugify(editing.slug) : 'producto';
    const nameParts = (file.name || 'foto.png').split('.');
    const ext = (nameParts[nameParts.length - 1] || 'png').toLowerCase().slice(0, 5);
    const path = slug + '-' + Date.now() + '.' + ext;
    try {
      showToast('Subiendo foto…');
      const res = await db.storage.from(sb.bucket).upload(path, file, { cacheControl: '3600', upsert: false });
      if (res.error) throw res.error;
      const pub = db.storage.from(sb.bucket).getPublicUrl(path);
      state.photoPickedPath = path;
      state.editing.photo_url = (pub && pub.data && pub.data.publicUrl) || '';
      state.editing.photo_path = path;
      if (state.oldPhotoPath && state.oldPhotoPath !== path) {
        state.editing.pendingPhotoDelete = state.oldPhotoPath;
      }
      renderEditor();
      showToast('Foto lista. Se guarda al presionar Guardar. ✅', 'ok');
    } catch (e) {
      showToast('No se pudo subir la foto: ' + cleanError(e, 'error de subida'), 'err');
    }
  }

  function onEditorInput(event) {
    const el = event.target;
    if (!el.matches || !el.matches('input[data-f], textarea[data-f], input[data-p], input[data-of], input[data-cf], input[data-ff]')) return;

    if (el.dataset.f) {
      const key = el.dataset.f;
      const value = el.type === 'checkbox' ? el.checked : el.value;
      if (key === 'price' || key === 'featured' || key === 'sort') {
        state.editing[key] = el.value === '' ? (key === 'featured' ? null : null) : Number(el.value);
      } else {
        state.editing[key] = value;
      }
      if (key === 'name' && !state.isNew) {
        /* no regenerar slug al editar existente */
      } else if (key === 'name' && state.isNew) {
        const slugInput = els.editorBody.querySelector('input[data-f="slug"]');
        if (slugInput && document.activeElement !== slugInput) {
          state.editing.slug = slugify(el.value);
          slugInput.value = state.editing.slug;
        }
      }
      return;
    }

    if (el.dataset.p != null) {
      state.editing.palette[Number(el.dataset.p)] = el.value;
      return;
    }

    if (el.dataset.of != null) {
      const i = Number(el.dataset.opt);
      state.editing.options[i].label = el.value;
      state.editing.options[i].name = slugify(el.value) || ('op' + (i + 1));
      return;
    }

    if (el.dataset.cf != null) {
      const i = Number(el.dataset.opt);
      const j = Number(el.dataset.choice);
      const value = state.editing.options[i].values[j];
      if (el.dataset.cf === 'price') value.price = el.value === '' ? 0 : Number(el.value) || 0;
      else value.label = el.value;
      return;
    }

    if (el.dataset.ff != null) {
      const i = Number(el.dataset.field);
      const key = el.dataset.ff;
      const field = state.editing.fields[i];
      if (key === 'maxlength') field.maxlength = el.value === '' ? null : Math.max(1, Number(el.value) || 60);
      else if (key !== 'required' && key !== 'type') field[key] = el.value;
    }
  }

  function onEditorClick(event) {
    const target = event.target.closest('button');
    if (!target) return;

    if (target.id === 'photo-remove') {
      state.editing.photo_url = '';
      state.editing.photo_path = '';
      state.editing.pendingPhotoDelete = state.oldPhotoPath;
      state.oldPhotoPath = '';
      renderEditor();
      return;
    }
    if (target.id === 'add-option') {
      state.editing.options.push({
        name: 'op' + (state.editing.options.length + 1),
        label: 'Opción ' + (state.editing.options.length + 1),
        values: [{ label: 'Primera alternativa', price: 0 }]
      });
      refreshOptions();
      return;
    }
    if (target.dataset.removeOption != null) {
      state.editing.options.splice(Number(target.dataset.removeOption), 1);
      refreshOptions();
      return;
    }
    if (target.dataset.addChoice != null) {
      const i = Number(target.dataset.addChoice);
      state.editing.options[i].values.push({ label: 'Otra', price: 0 });
      refreshOptions();
      return;
    }
    if (target.dataset.removeChoice != null) {
      const parts = String(target.dataset.removeChoice).split(':');
      state.editing.options[Number(parts[0])].values.splice(Number(parts[1]), 1);
      refreshOptions();
      return;
    }
    if (target.id === 'add-field') {
      state.editing.fields.push({
        name: 'campo' + (state.editing.fields.length + 1),
        label: 'Campo ' + (state.editing.fields.length + 1),
        type: 'text',
        placeholder: '',
        required: false,
        maxlength: 60
      });
      refreshFields();
      return;
    }
    if (target.dataset.removeField != null) {
      state.editing.fields.splice(Number(target.dataset.removeField), 1);
      refreshFields();
      return;
    }
  }

  function refreshOptions() {
    const holder = els.editorBody.querySelector('#options-list');
    if (holder) holder.innerHTML = renderOptionsHTML(state.editing);
  }

  function refreshFields() {
    const holder = els.editorBody.querySelector('#fields-list');
    if (holder) holder.innerHTML = renderFieldsHTML(state.editing);
  }

  function validateEditing() {
    const row = state.editing;
    if (!row.name.trim()) return 'Escribe el nombre del producto.';
    if (row.price == null || !isFinite(row.price) || row.price < 0) return 'Revisa el precio base.';
    row.name = row.name.trim();
    row.slug = slugify(row.slug || row.name);
    if (!row.slug) return 'Define un enlace (slug) para el producto.';
    row.options = (row.options || []).filter(function (option) {
      return option.label && option.label.trim() && (option.values || []).length > 0;
    }).map(function (option) {
      return {
        name: slugify(option.name || option.label) || 'op',
        label: option.label.trim(),
        values: option.values.filter(function (value) { return value.label && value.label.trim(); })
          .map(function (value) { return { label: value.label.trim(), price: Number(value.price) || 0 }; })
      };
    });
    const rawFields = (row.fields || []).filter(function (field) {
      return field.label && field.label.trim();
    });
    row.fields = rawFields.map(function (field, index) {
      const base = slugify(field.name || field.label) || ('campo' + (index + 1));
      let name = base;
      let delta = 1;
      while (rawFields.some(function (other, otherIndex) {
        return otherIndex !== index && other.name === name;
      })) {
        name = base + '-' + delta;
        delta += 1;
      }
      return {
        name: name,
        label: field.label.trim(),
        type: field.type || 'text',
        placeholder: field.placeholder || '',
        required: !!field.required,
        maxlength: field.maxlength || null
      };
    });
    row.includes = (Array.isArray(row.includes) ? row.includes.join('\n') : String(row.includes || ''))
      .split('\n')
      .map(function (line) { return line.trim(); })
      .filter(function (line) { return line; });
    row.palette = ['#ffffff', '#ffffff', '#ffffff', '#ffffff'].map(function (_, i) {
      const current = (row.palette && row.palette[i]) || '';
      if (/^#[0-9a-fA-F]{6}$/.test(current)) return current;
      return '#743142';
    });
    row.badge = String(row.badge || '').trim();
    row.lead = String(row.lead || '').trim();
    row.description = String(row.description || '').trim();
    row.delivery = String(row.delivery || '').trim();
    row.tags = String(row.tags || '').trim();
    return '';
  }

  async function saveEditor() {
    const problem = validateEditing();
    if (problem) {
      els.editorError.textContent = problem;
      els.editorError.hidden = false;
      return;
    }
    const row = state.editing;
    els.editorSave.disabled = true;
    try {
      if (row.price == null) row.price = 0;
      if (row.sort == null) row.sort = 100;
      const payload = {
        slug: row.slug,
        name: row.name,
        category: row.category,
        lead: row.lead,
        description: row.description,
        price: Math.round(Number(row.price) || 0),
        badge: row.badge,
        featured: row.featured == null ? null : Math.round(Number(row.featured) || 0),
        palette: row.palette,
        options: row.options,
        fields: row.fields,
        includes: row.includes,
        delivery: row.delivery,
        tags: row.tags,
        photo_url: row.photo_url || '',
        photo_path: row.photo_path || '',
        published: !!row.published,
        sort: Math.round(Number(row.sort) || 0)
      };
      let res;
      if (state.isNew) {
        res = await db.from('tienda_products').insert([payload]);
      } else {
        res = await db.from('tienda_products').update(payload).eq('id', row.id);
      }
      if (res.error) throw res.error;

      /* limpieza de foto reemplazada o quitada */
      const stalePath = row.pendingPhotoDelete;
      if (stalePath) {
        try { db.storage.from(sb.bucket).remove([stalePath]); } catch (e) { /* best effort */ }
      }
      state.photoPickedPath = '';
      closeEditor(false);
      showToast('Producto guardado.', 'ok');
      await loadProducts(true);
    } catch (e) {
      els.editorError.textContent = cleanError(e, 'No se pudo guardar. ¿Ya ejecutaste el SQL?');
      els.editorError.hidden = false;
    } finally {
      els.editorSave.disabled = false;
    }
  }

  /* ===================== ACCIONES DE FILA ===================== */

  async function onRowToggle(rowId, published) {
    const res = await db.from('tienda_products').update({ published: published }).eq('id', rowId);
    if (res.error) {
      showToast('No se pudo cambiar el estado: ' + cleanError(res.error, ''), 'err');
      renderList();
      return;
    }
    showToast(published ? 'Producto publicado.' : 'Producto oculto del catálogo.', 'ok');
    renderList();
  }

  async function onRowDelete(rowId) {
    const row = state.rows.filter(function (item) { return item.id === rowId; })[0];
    if (!row) return;
    if (!window.confirm('¿Eliminar "' + row.name + '"? Esta acción no se puede deshacer.')) return;
    const res = await db.from('tienda_products').delete().eq('id', rowId);
    if (res.error) {
      showToast('No se pudo eliminar: ' + cleanError(res.error, ''), 'err');
      return;
    }
    if (row.photo_path) {
      try { await db.storage.from(sb.bucket).remove([row.photo_path]); } catch (e) { /* best effort */ }
    }
    showToast('Producto eliminado.', 'ok');
    state.rows = state.rows.filter(function (item) { return item.id !== rowId; });
    renderList();
  }

  /* ===================== ARRANQUE ===================== */

  function bind() {
    if (els.loginForm) els.loginForm.addEventListener('submit', handleLogin);
    if (els.btnSignup) els.btnSignup.addEventListener('click', handleSignup);
    if (els.btnLogout) els.btnLogout.addEventListener('click', handleLogout);
    if (els.btnRefresh) els.btnRefresh.addEventListener('click', function () { loadProducts(); });
    if (els.btnNewProduct) els.btnNewProduct.addEventListener('click', function () { openEditor(blankRow(), true); });
    if (els.btnImportDemo) els.btnImportDemo.addEventListener('click', importDemo);
    if (els.search) els.search.addEventListener('input', renderList);
    if (els.editorCancel) els.editorCancel.addEventListener('click', function () { closeEditor(true); });
    if (els.editorClose) els.editorClose.addEventListener('click', function () { closeEditor(true); });
    if (els.editorSave) els.editorSave.addEventListener('click', saveEditor);
    if (els.editorBody) {
      els.editorBody.addEventListener('input', onEditorInput);
      els.editorBody.addEventListener('click', onEditorClick);
      els.editorBody.addEventListener('change', onEditorChange);
    }
    if (els.dialog) {
      els.dialog.addEventListener('cancel', function (event) {
        event.preventDefault();
        closeEditor(true);
      });
    }
    if (els.list) {
      els.list.addEventListener('click', function (event) {
        const editBtn = event.target.closest('[data-edit]');
        if (editBtn) {
          const row = state.rows.filter(function (item) { return item.id === editBtn.getAttribute('data-edit'); })[0];
          if (row) openEditor(row, false);
          return;
        }
        const delBtn = event.target.closest('[data-delete]');
        if (delBtn) {
          onRowDelete(delBtn.getAttribute('data-delete'));
        }
      });
      els.list.addEventListener('change', function (event) {
        const input = event.target.closest('[data-toggle-input]');
        if (input) {
          onRowToggle(input.getAttribute('data-toggle-input'), input.checked);
        }
      });
    }
  }

  async function boot() {
    if (!sb) {
      switchView('login');
      els.loginError.textContent = 'Falta la configuración de Supabase (js/config.js).';
      els.loginError.hidden = false;
      if (els.loading) els.loading.hidden = true;
      return;
    }
    if (!db) {
      switchView('login');
      els.loginError.textContent = 'No se pudo cargar la librería de Supabase (revisa tu conexión).';
      els.loginError.hidden = false;
      return;
    }
    bind();
    db.auth.onAuthStateChange(function (event, session) {
      if (event === 'SIGNED_OUT' || (!session && state.currentAdmin)) {
        state.currentAdmin = false;
        switchView('login');
      }
    });
    const { data } = await db.auth.getSession();
    if (data && data.session && data.session.user) {
      try {
        await enterPanel(true);
      } catch (e) {
        await ensureNoAccess('Tu sesión no tiene permisos de administrador.');
      }
    } else {
      switchView('login');
    }
    if (els.loading) els.loading.hidden = true;
  }

  boot();
})();
