/**
 * مؤسسة تركيب شبوك مزارع وأراضي وملاعب وسياج وحواجز أمنية
 * Google Ads Tracking Engine & Mobile UX Core (Vanilla JS)
 * Version: 2.0.0
 */

(function () {
  'use strict';

  // -------------------------------------------------------------
  // 1. كائن الإعدادات والتحويلات الخاص بإعلانات Google والاتصالات
  // -------------------------------------------------------------
  const APP_CONFIG = {
    CONVERSION_ID: 'AW-xxxxxxxxxxxxx',
    LABELS: {
      CALL: 'xxxxxxxxxxxxxxxxx',
      WHATSAPP: 'xxxxxxxxxxxxxx',
      FORM: 'xxxxxxxxxxxxxxxxxxx'
    },
    DEV_PHONE: '966578539687',
    CLIENT_PHONE: '966505898112',
    CLIENT_TEL: '0505898112'
  };

  // -------------------------------------------------------------
  // 2. الحقن التلقائي لوسم Google Ads Tag (gtag.js)
  // -------------------------------------------------------------
  function injectGoogleTag() {
    if (document.querySelector(`script[src*="${APP_CONFIG.CONVERSION_ID}"]`)) return;

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };

    window.gtag('js', new Date());
    window.gtag('config', APP_CONFIG.CONVERSION_ID);

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${APP_CONFIG.CONVERSION_ID}`;
    document.head.appendChild(script);
  }

  injectGoogleTag();

  // -------------------------------------------------------------
  // 3. دالة إرسال إحالات Google Ads مع حماية المتصفح (Beacon)
  // -------------------------------------------------------------
  function reportConversion(label, callback) {
    if (typeof window.gtag === 'function' && label && !label.includes('xxxx')) {
      window.gtag('event', 'conversion', {
        send_to: `${APP_CONFIG.CONVERSION_ID}/${label}`,
        transport_type: 'beacon',
        event_callback: function () {
          if (typeof callback === 'function') callback();
        }
      });
    } else {
      if (typeof callback === 'function') callback();
    }
  }

  // -------------------------------------------------------------
  // 4. الرصد الشامل للنقرات (Global Click Delegation)
  // -------------------------------------------------------------
  document.addEventListener('click', function (event) {
    const targetLink = event.target.closest('a');
    if (!targetLink) return;

    const href = (targetLink.getAttribute('href') || '').trim();

    // 1. استثناء رقم ورابط المطور فوراً لمنع حرق الميزانية
    if (href.includes(APP_CONFIG.DEV_PHONE) || href.includes('0578539687')) {
      return;
    }

    // 2. فحص نقرات الواتساب وإرسال الإحالة
    if (href.includes('wa.me') || href.includes('whatsapp.com')) {
      reportConversion(APP_CONFIG.LABELS.WHATSAPP);
      return;
    }

    // 3. فحص نقرات الاتصال الهاتفي وإرسال الإحالة
    if (href.startsWith('tel:')) {
      reportConversion(APP_CONFIG.LABELS.CALL);
      return;
    }
  }, true);

  // -------------------------------------------------------------
  // 5. معالجة النماذج الذكية (.smart-lead-form)
  // -------------------------------------------------------------
  function initSmartForms() {
    const forms = document.querySelectorAll('.smart-lead-form');
    forms.forEach(form => {
      form.addEventListener('submit', function (e) {
        e.preventDefault();

        const nameInput = form.querySelector('[name="name"]');
        const phoneInput = form.querySelector('[name="phone"]');
        const serviceInput = form.querySelector('[name="service"]');
        const notesInput = form.querySelector('[name="notes"]');
        const submitBtn = form.querySelector('button[type="submit"]');

        const name = nameInput ? nameInput.value.trim() : 'غير محدد';
        const phone = phoneInput ? phoneInput.value.trim() : 'غير محدد';
        const service = serviceInput ? serviceInput.value.trim() : 'طلب تسعير شبوك وسياج';
        const notes = notesInput ? notesInput.value.trim() : 'بدون ملاحظات إضافية';

        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.dataset.originalText = submitBtn.innerHTML;
          submitBtn.innerHTML = 'جاري المعالجة وإعادة التوجيه... ⏳';
        }

        // إرسال إحالة النموذج
        reportConversion(APP_CONFIG.LABELS.FORM, function () {
          const messageText = `مرحباً، أود الاستفسار وطلب تسعير لتركيب شبوك وسياج:\n\n👤 *الاسم:* ${name}\n📱 *الجوال:* ${phone}\n🏗️ *الخدمة المطلوبة:* ${service}\n📝 *الملاحظات/المساحة:* ${notes}`;
          const waUrl = `https://wa.me/${APP_CONFIG.CLIENT_PHONE}?text=${encodeURIComponent(messageText)}`;
          
          setTimeout(() => {
            window.location.href = waUrl;
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.innerHTML = submitBtn.dataset.originalText;
            }
            form.reset();
          }, 300);
        });
      });
    });
  }

  // -------------------------------------------------------------
  // 6. التحكم بالقائمة الجانبية للجوال (Native Mobile Sidebar)
  // -------------------------------------------------------------
  function initMobileMenu() {
    const toggleBtn = document.querySelector('.nav-toggle-btn');
    const closeBtn = document.querySelector('.sidebar-close-btn');
    const overlay = document.querySelector('.mobile-sidebar-overlay');
    const sidebar = document.querySelector('.mobile-sidebar');

    function openSidebar() {
      if (sidebar && overlay) {
        sidebar.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    }

    function closeSidebar() {
      if (sidebar && overlay) {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    }

    if (toggleBtn) toggleBtn.addEventListener('click', openSidebar);
    if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
    if (overlay) overlay.addEventListener('click', closeSidebar);

    // أكورديون الخدمات داخل القائمة الجانبية للجوال
    const sidebarAccordion = document.querySelector('.accordion-toggle');
    const sidebarSubMenu = document.querySelector('.sidebar-sub-menu');

    if (sidebarAccordion && sidebarSubMenu) {
      sidebarAccordion.addEventListener('click', function (e) {
        e.preventDefault();
        this.classList.toggle('open');
        sidebarSubMenu.classList.toggle('open');
      });
    }
  }

  // -------------------------------------------------------------
  // 7. أكورديون الأسئلة الشائعة (FAQ Accordion)
  // -------------------------------------------------------------
  function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      if (question) {
        question.addEventListener('click', () => {
          const isOpen = item.classList.contains('open');
          faqItems.forEach(i => i.classList.remove('open'));
          if (!isOpen) {
            item.classList.add('open');
          }
        });
      }
    });
  }

  // -------------------------------------------------------------
  // 8. الحقن التلقائي لأزرار التواصل العائمة وزر الصعود للأعلى
  // -------------------------------------------------------------
  function injectFloatingActions() {
    if (document.querySelector('.floating-cta-container')) return;

    const container = document.createElement('div');
    container.className = 'floating-cta-container';
    container.innerHTML = `
      <button type="button" class="floating-btn scroll-top" aria-label="العودة لأعلى الصفحة" title="أعلى الصفحة">↑</button>
      <a href="https://wa.me/${APP_CONFIG.CLIENT_PHONE}?text=${encodeURIComponent('السلام عليكم، أود الاستفسار عن تركيب شبوك وسياج أمني')}" class="floating-btn whatsapp" target="_blank" rel="noopener noreferrer" aria-label="محادثة واتساب مباشرة" title="محادثة واتساب">💬</a>
      <a href="tel:${APP_CONFIG.CLIENT_TEL}" class="floating-btn call" aria-label="اتصال هاتفي مباشر" title="اتصل بنا الآن">📞</a>
    `;

    document.body.appendChild(container);

    const scrollTopBtn = container.querySelector('.scroll-top');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 350) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // -------------------------------------------------------------
  // 9. تشغيل العناصر عند اكتمال تحميل الـ DOM
  // -------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initSmartForms();
    initFaqAccordion();
    injectFloatingActions();
  });
})();
