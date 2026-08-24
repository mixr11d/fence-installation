/**
 * مؤسسة تركيب شبوك مزارع وأراضي وملاعب وسياج وحواجز أمنية
 * Google Ads Tracking Engine & Mobile UX Core (Ultra-Fast 100% Web Vitals)
 * Version: 3.0.0
 */

(function () {
  'use strict';

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

  // تأجيل تحميل سكريبت قوقل حتى اكتمال رسم أول محتوى (LCP Optimization)
  function initGoogleTag() {
    if (window.gtagInitialized) return;
    window.gtagInitialized = true;

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

  // تحميل تتبع قوقل في وقت خمول المعالج بعد رسم الصفحة
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(initGoogleTag, { timeout: 2500 });
  } else {
    window.addEventListener('load', () => setTimeout(initGoogleTag, 1000));
  }

  // دالة إرسال الإحالات
  function reportConversion(label, callback) {
    initGoogleTag();
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

  // الرصد الشامل للنقرات
  document.addEventListener('click', function (event) {
    const targetLink = event.target.closest('a');
    if (!targetLink) return;

    const href = (targetLink.getAttribute('href') || '').trim();

    if (href.includes(APP_CONFIG.DEV_PHONE) || href.includes('0578539687')) {
      return;
    }

    if (href.includes('wa.me') || href.includes('whatsapp.com')) {
      reportConversion(APP_CONFIG.LABELS.WHATSAPP);
      return;
    }

    if (href.startsWith('tel:')) {
      reportConversion(APP_CONFIG.LABELS.CALL);
      return;
    }
  }, true);

  // النماذج الذكية
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
        const service = serviceInput ? serviceInput.value.trim() : 'طلب تسعير شبوك';
        const notes = notesInput ? notesInput.value.trim() : 'بدون ملاحظات إضافية';

        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.dataset.originalText = submitBtn.innerHTML;
          submitBtn.innerHTML = 'جاري التحويل للواتساب... ⏳';
        }

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
          }, 250);
        });
      });
    });
  }

  // القائمة الجانبية للجوال
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

  // أكورديون الأسئلة الشائعة
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

  // حقن الأزرار العائمة
  function injectFloatingActions() {
    if (!document.querySelector('.floating-contact-right')) {
      const rightContainer = document.createElement('div');
      rightContainer.className = 'floating-contact-right';
      rightContainer.innerHTML = `
        <a href="https://wa.me/${APP_CONFIG.CLIENT_PHONE}?text=${encodeURIComponent('السلام عليكم، أود الاستفسار عن تركيب شبوك وسياج أمني')}" class="floating-btn whatsapp" target="_blank" rel="noopener noreferrer" aria-label="محادثة واتساب مباشرة" title="محادثة واتساب">💬</a>
        <a href="tel:${APP_CONFIG.CLIENT_TEL}" class="floating-btn call" aria-label="اتصال هاتفي مباشر" title="اتصل بنا الآن">📞</a>
      `;
      document.body.appendChild(rightContainer);
    }

    if (!document.querySelector('.floating-scroll-left')) {
      const leftContainer = document.createElement('div');
      leftContainer.className = 'floating-scroll-left';
      leftContainer.innerHTML = `
        <button type="button" class="floating-btn scroll-top" aria-label="العودة لأعلى الصفحة" title="أعلى الصفحة">↑</button>
      `;
      document.body.appendChild(leftContainer);

      const scrollTopBtn = leftContainer.querySelector('.scroll-top');
      window.addEventListener('scroll', () => {
        if (window.scrollY > 350) {
          scrollTopBtn.classList.add('visible');
        } else {
          scrollTopBtn.classList.remove('visible');
        }
      }, { passive: true });

      scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initSmartForms();
    initFaqAccordion();
    injectFloatingActions();
  });
})();
