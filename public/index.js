// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
document.querySelector('.burger').addEventListener('click', function() {
    document.querySelector('.nav-links').classList.toggle('active');
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
        document.querySelector('.nav-links').classList.remove('active');
    });
});

function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({
        behavior: 'smooth'
    });
}

function openBookingForm(serviceName) {
    const modal = document.getElementById('bookingModal');
    const serviceTitle = document.getElementById('serviceTitle');
    const serviceSelect = document.getElementById('service');

    serviceTitle.textContent = `Book ${serviceName}`;

    if (serviceName && serviceSelect) {
        for (let i = 0; i < serviceSelect.options.length; i++) {
            if (serviceSelect.options[i].text.includes(serviceName)) {
                serviceSelect.selectedIndex = i;
                break;
            }
        }
    }

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeBookingForm() {
    document.getElementById('bookingModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function openGalleryModal(imgSrc) {
    const modal = document.getElementById('galleryModal');
    const img = document.getElementById('galleryModalImg');
    img.src = imgSrc;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeGalleryModal() {
    document.getElementById('galleryModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

window.onclick = function(event) {
    const bookingModal = document.getElementById('bookingModal');
    const galleryModal = document.getElementById('galleryModal');

    if (event.target == bookingModal) closeBookingForm();
    if (event.target == galleryModal) closeGalleryModal();
};

document.addEventListener("DOMContentLoaded", function () {
    const bookingForm = document.getElementById("bookingForm");

    if (!bookingForm) {
        console.error("Booking form not found!");
        return;
    }

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    document.getElementById("date").min = `${yyyy}-${mm}-${dd}`;

    bookingForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        document.querySelectorAll(".error-message").forEach(el => el.remove());
        let isValid = true;

        const name = document.getElementById("name").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const email = document.getElementById("email").value.trim();
        const service = document.getElementById("service").value.trim();
        const date = document.getElementById("date").value;
        const time = document.getElementById("time").value.trim();

        if (!name) { showError("name", "Full name is required."); isValid = false; }
        if (!/^\d{10}$/.test(phone)) { showError("phone", "Enter a valid 10-digit phone number."); isValid = false; }
        if (!/^\S+@\S+\.\S+$/.test(email)) { showError("email", "Enter a valid email address."); isValid = false; }
        if (!service) { showError("service", "Please select a service."); isValid = false; }

        const todayDate = new Date();
        todayDate.setHours(0,0,0,0);
        const selectedDate = new Date(date);
        if (selectedDate < todayDate) { showError("date", "Please select a valid date."); isValid = false; }

        if (!time) { showError("time", "Please select a preferred time."); isValid = false; }

        if (!isValid) return;

        const barber = document.getElementById("barber").value.trim();
        const notes = document.getElementById("notes").value.trim();

        const bookingData = { name, phone, email, service, date, time, barber, notes };

        try {
            const response = await fetch('/api/booking', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingData)
            });

            const result = await response.json();
            if (response.ok) {
                alert(result.message || "Booking successfully submitted!");
                bookingForm.reset();
                closeBookingForm();
            } else {
                alert(result.message || "Something went wrong. Please try again!");
            }
        } catch (error) {
            console.error("Error submitting booking:", error);
            alert("Error sending booking request. Please check your connection.");
        }
    });
});

function showError(fieldId, message) {
    let field = document.getElementById(fieldId);
    let error = document.createElement("div");
    error.className = "error-message";
    error.style.color = "red";
    error.style.fontSize = "0.85em";
    error.style.marginTop = "5px";
    error.textContent = message;
    field.parentNode.appendChild(error);
}

document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const formData = {
        name: document.getElementById('contact-name').value,
        email: document.getElementById('contact-email').value,
        subject: document.getElementById('contact-subject').value,
        message: document.getElementById('contact-message').value
    };

    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        if (response.ok) {
            alert('Thank you for your message! We will get back to you soon.');
            this.reset();
        } else {
            throw new Error(data.error || 'Failed to send message');
        }
    } catch (error) {
        alert(`Error: ${error.message}`);
        console.error('Contact form error:', error);
    }
});

document.getElementById('newsletterForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = this.querySelector('input[type="email"]').value;

    try {
        const response = await fetch('/api/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        const data = await response.json();
        if (response.ok) {
            alert(`Thank you for subscribing with ${email}!`);
            this.reset();
        } else {
            throw new Error(data.error || 'Failed to subscribe');
        }
    } catch (error) {
        alert(`Error: ${error.message}`);
        console.error('Subscription error:', error);
    }
});

// camera

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const openCameraBtn = document.getElementById('openCameraBtn');
    const uploadBtn = document.getElementById('uploadBtn');
    const fileInput = document.getElementById('fileInput');
    const cameraFeed = document.getElementById('cameraFeed');
    const photoCanvas = document.getElementById('photoCanvas');
    const placeholder = document.getElementById('placeholder');
    const captureBtn = document.getElementById('captureBtn');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const results = document.getElementById('results');
    const hairstyleSuggestions = document.getElementById('hairstyleSuggestions');
    const resetBtn = document.getElementById('resetBtn'); // Reset button added

    let stream = null;
    
    // Face shapes and recommended hairstyles with unique images
    const hairstyleRecommendations = {'oval': [
            { name: 'Classic Pompadour', img: 'img\men bun cut.jpg' },
            { name: 'Side Part', img: 'https://www.dmarge.com/wp-content/uploads/2014/09/Last-Import-044.jpg' },
            { name: 'Textured Crop', img: 'https://example.com/texturedcrop.jpg'}
        ],
        'round': [
            { name: 'Angular Fade', img: 'https://example.com/angularfade.jpg' },
            { name: 'High Fade', img: 'https://i.pinimg.com/originals/9d/9a/e9/9d9ae9a0c5cb2cfb1375b57dd836474c.jpg' },
            { name: 'modern mullet cut', img: 'https://i.pinimg.com/originals/2d/59/da/2d59da702663712a7c9c53375a6a472a.jpg' }
        ],
        'square': [
            { name: 'Buzz Cut', img: 'https://i.pinimg.com/originals/9d/9a/e9/9d9ae9a0c5cb2cfb1375b57dd836474c.jpg' },
            { name: 'French Crop', img: 'img\slick back.jpg' },
            { name: 'Slick Back', img: 'img\slick back.jpg' }
        ],
        'heart': [
            { name: 'Side Swept', img: 'https://www.dmarge.com/wp-content/uploads/2014/09/Last-Import-044.jpg' },
            { name: 'Taper Fade', img: 'https://i.pinimg.com/originals/ff/3f/11/ff3f11694a519bdedbb7f9bf73f9d1a5.jpg' },
            { name: 'Long Top Short Sides', img: 'https://i.pinimg.com/originals/98/30/f3/9830f3c7e7cf78f24d157f1d9967ae64.jpg' }
        ],
        'diamond': [
            { name: 'Fringe', img: 'https://haircutinspiration.com/wp-content/uploads/Medium-Slick-Back-1-1.jpg' },
            { name: 'Comb Over', img: 'https://i.pinimg.com/originals/98/30/f3/9830f3c7e7cf78f24d157f1d9967ae64.jpg' },
            { name: 'Undercut', img: 'img\wolf cut.jpg' }
        ]
    };

    // Open camera
    openCameraBtn.addEventListener('click', async function() {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: true });
            cameraFeed.srcObject = stream;
            cameraFeed.style.display = 'block';
            placeholder.style.display = 'none';
            captureBtn.style.display = 'block';
            analyzeBtn.style.display = 'none';
        } catch (err) {
            alert('Could not access camera: ' + err.message);
        }
    });

    // Upload photo
    uploadBtn.addEventListener('click', function() {
        fileInput.click();
    });

    fileInput.addEventListener('change', function(e) {
        if (e.target.files.length) {
            const file = e.target.files[0];
            const reader = new FileReader();
            
            reader.onload = function(event) {
                const img = new Image();
                img.onload = function() {
                    photoCanvas.width = img.width;
                    photoCanvas.height = img.height;
                    const ctx = photoCanvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);
                    
                    photoCanvas.style.display = 'block';
                    placeholder.style.display = 'none';
                    analyzeBtn.style.display = 'block';
                    
                    if (stream) {
                        stream.getTracks().forEach(track => track.stop());
                        cameraFeed.style.display = 'none';
                    }
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Capture photo from camera
    captureBtn.addEventListener('click', function() {
        photoCanvas.width = cameraFeed.videoWidth;
        photoCanvas.height = cameraFeed.videoHeight;
        const ctx = photoCanvas.getContext('2d');
        ctx.drawImage(cameraFeed, 0, 0, photoCanvas.width, photoCanvas.height);
        
        photoCanvas.style.display = 'block';
        cameraFeed.style.display = 'none';
        captureBtn.style.display = 'none';
        analyzeBtn.style.display = 'block';
    });

    // Analyze face and recommend hairstyles
    analyzeBtn.addEventListener('click', function() {
        // Simulate face shape detection
        const faceShapes = Object.keys(hairstyleRecommendations);
        const randomShape = faceShapes[Math.floor(Math.random() * faceShapes.length)];

        // Display results
        results.style.display = 'block';
        hairstyleSuggestions.innerHTML = '';

        // Add detected face shape
        const shapeElement = document.createElement('div');
        shapeElement.innerHTML = `
            <p style="grid-column: 1/-1; text-align: center; font-weight: bold;">
                Detected Face Shape: <span style="color: #d4af37;">${randomShape.toUpperCase()}</span>
            </p>
        `;
        hairstyleSuggestions.appendChild(shapeElement);

        // Add recommended hairstyles with unique images
        hairstyleRecommendations[randomShape].forEach(hairstyle => {
            const hairstyleElement = document.createElement('div');
            hairstyleElement.innerHTML = `
                <div style="background: #f9f9f9; padding: 1rem; border-radius: 5px; text-align: center;">
                    <img src="${hairstyle.img}" 
                         alt="${hairstyle.name}" 
                         style="width: 100%; height: 120px; object-fit: cover; border-radius: 3px; margin-bottom: 0.5rem;">
                    <p style="font-weight: 500;">${hairstyle.name}</p>
                    <button class="book-btn" onclick="openBookingForm('${hairstyle.name}')" style="margin-top: 0.5rem;">Book This Style</button>
                </div>
            `;
            hairstyleSuggestions.appendChild(hairstyleElement);
        });

        // Show reset button
        resetBtn.style.display = 'block';

        // Scroll to results
        results.scrollIntoView({ behavior: 'smooth' });
    });


    // Clean up camera when leaving the section
    document.querySelector('#virtual-tryon').addEventListener('mouseleave', function() {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            cameraFeed.style.display = 'none';
        }
    });
});
// reset button
document.getElementById("myButton").addEventListener("click", function() {
    console.log("Button clicked!");
});
