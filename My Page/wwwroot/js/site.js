(function () {
    'use strict';

    var root = document.documentElement;
    root.classList.add('js');

    document.addEventListener('DOMContentLoaded', function () {
        var header = document.getElementById('cabecera');
        var btnArriba = document.getElementById('btnVolverArriba');
        var btnTema = document.getElementById('btnTema');
        var btnMenu = document.getElementById('btnMenu');
        var menu = document.getElementById('menu');

        /* ---------- Tema claro / oscuro ---------- */
        function temaActual() {
            var t = root.getAttribute('data-theme');
            if (t) return t;
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }

        if (btnTema) {
            btnTema.addEventListener('click', function () {
                var nuevo = temaActual() === 'dark' ? 'light' : 'dark';
                root.setAttribute('data-theme', nuevo);
                try { localStorage.setItem('tema', nuevo); } catch (e) { }
            });
        }

        /* ---------- Menú móvil ---------- */
        function cerrarMenu() {
            if (!menu) return;
            menu.classList.remove('open');
            btnMenu.setAttribute('aria-expanded', 'false');
        }

        if (btnMenu && menu) {
            btnMenu.addEventListener('click', function () {
                var abierto = menu.classList.toggle('open');
                btnMenu.setAttribute('aria-expanded', abierto ? 'true' : 'false');
            });
            menu.querySelectorAll('a').forEach(function (a) {
                a.addEventListener('click', cerrarMenu);
            });
            document.addEventListener('keydown', function (e) {
                if (e.key === 'Escape') cerrarMenu();
            });
        }

        /* ---------- Scroll: cabecera y botón volver arriba ---------- */
        function onScroll() {
            var y = window.scrollY || document.documentElement.scrollTop;
            if (header) header.classList.toggle('scrolled', y > 8);
            if (btnArriba) btnArriba.classList.toggle('show', y > 500);
        }
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();

        if (btnArriba) {
            btnArriba.addEventListener('click', function (e) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        /* ---------- Animación de aparición ---------- */
        var revelar = document.querySelectorAll('.reveal');
        if ('IntersectionObserver' in window) {
            var io = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        io.unobserve(entry.target);
                    }
                });
            }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
            revelar.forEach(function (el) { io.observe(el); });
        } else {
            revelar.forEach(function (el) { el.classList.add('visible'); });
        }

        /* ---------- Enlace activo en el menú ---------- */
        var enlaces = menu ? menu.querySelectorAll('a[href^="/#"]') : [];
        var secciones = [];
        enlaces.forEach(function (a) {
            var s = document.getElementById(a.getAttribute('href').slice(2));
            if (s) secciones.push({ el: s, link: a });
        });

        if (secciones.length && 'IntersectionObserver' in window) {
            var spy = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;
                    secciones.forEach(function (s) {
                        s.link.classList.toggle('active', s.el === entry.target);
                    });
                });
            }, { rootMargin: '-45% 0px -50% 0px' });
            secciones.forEach(function (s) { spy.observe(s.el); });
        }
    });
})();
