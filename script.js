// ── Dark mode toggle ──
const checkbox   = document.getElementById('checkbox');
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
if (savedTheme === 'dark') checkbox.checked = true;

checkbox.addEventListener('change', () => {
    const theme = checkbox.checked ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
});

// ── Captcha setup ──
let captchaAnswer = 0;

function newCaptcha() {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    captchaAnswer = a + b;
    document.getElementById('captcha-q').textContent = `${a} + ${b}`;
    document.getElementById('captcha-answer').value = '';
    document.getElementById('captcha-error').style.display = 'none';
}

// ── Modal open/close ──
const fab         = document.getElementById('fabBtn');
const overlay     = document.getElementById('modalOverlay');
const modalClose  = document.getElementById('modalClose');
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const submitBtn   = contactForm.querySelector('.submit-btn');

fab.addEventListener('click', () => {
    overlay.classList.add('open');
    newCaptcha();
});

function closeModal() {
    overlay.classList.remove('open');
    contactForm.reset();
    contactForm.style.display = '';
    formSuccess.style.display = 'none';
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send Message';
    document.getElementById('captcha-error').style.display = 'none';
}

modalClose.addEventListener('click', closeModal);
overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ── Form submit — validate captcha, then POST via fetch to show success popup ──
contactForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Validate captcha
    const userAnswer = parseInt(document.getElementById('captcha-answer').value, 10);
    if (userAnswer !== captchaAnswer) {
        document.getElementById('captcha-error').style.display = 'block';
        newCaptcha();
        return;
    }

    // Show sending state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    try {
        const formData = new FormData(contactForm);
        const response = await fetch(contactForm.action, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
            // Show success message inside the modal
            contactForm.style.display = 'none';
            formSuccess.style.display = 'flex';
        } else {
            throw new Error('Server error');
        }
    } catch (err) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
        alert('Something went wrong. Please try again or email me directly.');
    }
});
