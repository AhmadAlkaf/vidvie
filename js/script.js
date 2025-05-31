document.addEventListener('DOMContentLoaded', () => {

    // === Navbar Toggle for Mobile ===
    const navbarToggle = document.querySelector('.navbar-toggle');
    const navbarLinks = document.querySelector('.navbar-links');

    if (navbarToggle && navbarLinks) {
        navbarToggle.addEventListener('click', () => {
            // Toggle the display style for the links
            if (navbarLinks.style.display === 'flex') { // Check if it's currently displayed as flex (or block)
                navbarLinks.style.display = 'none';
            } else {
                navbarLinks.style.display = 'flex'; // Or 'block' depending on your mobile layout needs
                 // Basic styling for dropdown appearance - needs CSS refinement
                navbarLinks.style.position = 'absolute';
                navbarLinks.style.top = 'var(--navbar-height)'; // Position below navbar
                navbarLinks.style.right = '0'; // Align to right in RTL
                navbarLinks.style.backgroundColor = 'var(--white)';
                navbarLinks.style.width = '100%';
                navbarLinks.style.flexDirection = 'column';
                navbarLinks.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                navbarLinks.style.padding = '10px 0';
                 // Add styling for list items in mobile view
                navbarLinks.querySelectorAll('li').forEach(li => {
                    li.style.textAlign = 'center';
                    li.style.margin = '10px 0';
                });
            }
        });
         // Close menu if clicking outside (optional but good UX)
        document.addEventListener('click', (event) => {
            if (!navbarLinks.contains(event.target) && !navbarToggle.contains(event.target) && navbarLinks.style.display === 'flex') {
                 navbarLinks.style.display = 'none';
            }
        });
    }


    // === Hero Slider (Index Page) ===
    const slides = document.querySelectorAll('.hero-slider .slide');
    const sliderNavButtons = document.querySelectorAll('.slider-nav button');
    let currentSlide = 0;
    const slideIntervalTime = 5000; // Time in ms (5 seconds)
    let slideInterval;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (sliderNavButtons[i]) {
               sliderNavButtons[i].classList.remove('active');
            }
        });
        if (slides[index]) {
             slides[index].classList.add('active');
        }
       if (sliderNavButtons[index]) {
           sliderNavButtons[index].classList.add('active');
       }
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length; // Loop back to 0
        showSlide(currentSlide);
    }

    function startSlideShow() {
        stopSlideShow(); // Clear existing interval if any
        if(slides.length > 1) { // Only start if more than one slide
             slideInterval = setInterval(nextSlide, slideIntervalTime);
        }
    }
    function stopSlideShow() {
         clearInterval(slideInterval);
    }


    if (slides.length > 0) {
        showSlide(currentSlide); // Show the first slide initially
        startSlideShow(); // Start automatic sliding

         // Pause on hover
        const heroSlider = document.querySelector('.hero-slider');
        if(heroSlider){
            heroSlider.addEventListener('mouseenter', stopSlideShow);
            heroSlider.addEventListener('mouseleave', startSlideShow);
        }


         // Manual navigation with dots
         if (sliderNavButtons.length > 0) {
             sliderNavButtons.forEach(button => {
                 button.addEventListener('click', () => {
                     const slideIndex = parseInt(button.getAttribute('data-slide'));
                     if (!isNaN(slideIndex)) {
                        currentSlide = slideIndex;
                        showSlide(currentSlide);
                        startSlideShow(); // Restart timer after manual click
                     }
                 });
             });
         }
    }


    // === Product Detail Page - Image Gallery ===
    const mainProductImage = document.getElementById('mainProductImage');
    const thumbnailImages = document.querySelectorAll('.thumbnail-images img');

    if (mainProductImage && thumbnailImages.length > 0) {
        thumbnailImages.forEach(thumb => {
            thumb.addEventListener('click', () => {
                // Change main image source
                const largeImageSrc = thumb.getAttribute('data-large');
                if (largeImageSrc) {
                    mainProductImage.src = largeImageSrc;
                    mainProductImage.alt = thumb.alt; // Update alt text
                }

                // Update active state for thumbnails
                thumbnailImages.forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
            });
             // Preload large images (optional, good for performance)
            const largeSrc = thumb.getAttribute('data-large');
            if (largeSrc) {
                const img = new Image();
                img.src = largeSrc;
            }
        });
    }

    // === Product Detail Page - Quantity Selector ===
    const quantityInputs = document.querySelectorAll('.quantity-selector input[type="number"]');

    quantityInputs.forEach(input => {
        const minusBtn = input.previousElementSibling; // Assumes button is directly before
        const plusBtn = input.nextElementSibling;     // Assumes button is directly after

        if (minusBtn && minusBtn.classList.contains('quantity-minus')) {
            minusBtn.addEventListener('click', () => {
                let currentValue = parseInt(input.value);
                if (currentValue > (input.min || 1)) { // Respect min attribute or default to 1
                    input.value = currentValue - 1;
                    // Trigger change event if needed for cart calculations
                    input.dispatchEvent(new Event('change'));
                }
            });
        }

        if (plusBtn && plusBtn.classList.contains('quantity-plus')) {
             plusBtn.addEventListener('click', () => {
                let currentValue = parseInt(input.value);
                const max = input.max || Infinity; // Respect max attribute or allow infinite
                if (currentValue < max) {
                    input.value = currentValue + 1;
                     // Trigger change event if needed for cart calculations
                    input.dispatchEvent(new Event('change'));
                }
            });
        }
         // Prevent direct invalid input (optional)
        input.addEventListener('change', () => {
             let currentValue = parseInt(input.value);
             const min = input.min || 1;
             const max = input.max || Infinity;
             if (isNaN(currentValue) || currentValue < min) {
                 input.value = min;
             } else if (currentValue > max) {
                 input.value = max;
             }
        });
    });


    // === Product Detail Page - Tabs ===
    const tabLinks = document.querySelectorAll('.tabs-nav .tab-link');
    const tabContents = document.querySelectorAll('.product-details-extended .tab-content');

    if (tabLinks.length > 0 && tabContents.length > 0) {
        tabLinks.forEach(link => {
            link.addEventListener('click', () => {
                const tabId = link.getAttribute('data-tab');

                // Deactivate all links and contents
                tabLinks.forEach(l => l.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));

                // Activate clicked link and corresponding content
                link.classList.add('active');
                const targetContent = document.getElementById(tabId);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
    }

     // === Add to Cart Button Interaction (Visual Feedback Only) ===
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn, .add-to-cart-quick');
    const cartCountSpan = document.querySelector('.cart-count');
    let cartItemCount = 0; // Simple counter for demo

     // Initialize cart count if span exists
     if (cartCountSpan) {
         // In a real app, you'd fetch the initial count from storage/server
         cartItemCount = parseInt(cartCountSpan.textContent) || 0;
     }


    addToCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default link behavior if it's an <a>

            const originalText = button.innerHTML;
            const originalIcon = button.querySelector('i') ? button.querySelector('i').outerHTML : ''; // Store icon if present

            // --- Add Product to Cart Logic would go here (e.g., using LocalStorage or API call) ---
            // For demonstration, we just update the button text and counter

            // Update button visual state
            button.innerHTML = `${originalIcon} <span style="font-style: italic;">تمت الإضافة!</span>`;
            button.disabled = true; // Disable temporarily
             button.style.backgroundColor = 'var(--success-color)'; // Change color briefly

            // Update cart counter (visual only)
             if(cartCountSpan) {
                 cartItemCount++;
                 cartCountSpan.textContent = cartItemCount;
                 // Add a small animation (optional)
                 cartCountSpan.style.transform = 'scale(1.3)';
                 setTimeout(() => {
                     cartCountSpan.style.transform = 'scale(1)';
                 }, 200);
             }

            // Revert button state after a delay
            setTimeout(() => {
                button.innerHTML = originalText;
                button.disabled = false;
                 button.style.backgroundColor = ''; // Revert color
            }, 1500); // Revert after 1.5 seconds
        });
    });


     // === Products Page - Price Range Slider Output ===
    const priceRangeInput = document.getElementById('price-range');
    const priceRangeOutput = document.querySelector('.price-range-output');

    if (priceRangeInput && priceRangeOutput) {
        // Update output on initial load
        priceRangeOutput.textContent = `${priceRangeInput.value} ر.س`;
         // Update output when slider changes
        priceRangeInput.addEventListener('input', () => {
            priceRangeOutput.textContent = `${priceRangeInput.value} ر.س`;
        });
    }


     // === Cart Page - Remove Item (Visual Only) ===
     const removeButtons = document.querySelectorAll('.cart-items .remove-item-btn');
     removeButtons.forEach(button => {
         button.addEventListener('click', () => {
             const rowToRemove = button.closest('tr'); // Find the table row containing the button
             if (rowToRemove) {
                // --- Remove from Cart Logic (LocalStorage/API) would go here ---
                 rowToRemove.remove(); // Remove the row from the table visually
                 // You would also need to recalculate totals here
                 console.log('Item removed (visually). Update totals needed.');
                 updateCartTotals(); // Call function to update totals
             }
         });
     });


     // === Cart Page - Update Totals (Basic Example) ===
     // This needs to be more robust in a real app, considering quantities, tax, shipping etc.
     function updateCartTotals() {
        const cartRows = document.querySelectorAll('.cart-items tbody tr');
        let subtotal = 0;
        const taxRate = 0.15; // 15% example

        cartRows.forEach(row => {
            const priceElement = row.querySelector('td:nth-child(3)'); // Assuming price is 3rd TD
            const quantityInput = row.querySelector('.quantity-selector input');
            const totalElement = row.querySelector('td:nth-child(5)'); // Assuming total is 5th TD

            if (priceElement && quantityInput && totalElement) {
                const price = parseFloat(priceElement.textContent.replace(/[^0-9.]/g, '')); // Extract number
                const quantity = parseInt(quantityInput.value);
                const itemTotal = price * quantity;

                 if(!isNaN(itemTotal)){
                     // Update the row total display
                     totalElement.textContent = `${itemTotal.toFixed(2)} ر.س`;
                     // Add to subtotal
                     subtotal += itemTotal;
                 }
            }
        });

         // Update the summary section
         const subtotalSpan = document.querySelector('.order-summary .summary-row:nth-child(1) span:last-child');
         const taxSpan = document.querySelector('.order-summary .summary-row:nth-child(3) span:last-child'); // Assuming tax is 3rd row
         const grandTotalSpan = document.querySelector('.order-summary .summary-row.total span:last-child');

         if(subtotalSpan) subtotalSpan.textContent = `${subtotal.toFixed(2)} ر.س`;

         const taxAmount = subtotal * taxRate;
         if(taxSpan) taxSpan.textContent = `${taxAmount.toFixed(2)} ر.س`;

         // Note: Shipping cost needs separate handling
         const shippingCost = 0; // Placeholder - Get actual shipping if calculated

         const grandTotal = subtotal + taxAmount + shippingCost;
         if(grandTotalSpan) grandTotalSpan.textContent = `${grandTotal.toFixed(2)} ر.س`;

         // Update cart count in navbar as well
         if(cartCountSpan) {
             const totalQuantity = Array.from(document.querySelectorAll('.cart-items .quantity-selector input'))
                                    .reduce((sum, input) => sum + parseInt(input.value), 0);
              cartCountSpan.textContent = totalQuantity;
              cartItemCount = totalQuantity; // Update the global demo counter
         }

          // Show message if cart is empty
         const cartTableBody = document.querySelector('.cart-items tbody');
         if(cartTableBody && cartTableBody.children.length === 0){
             cartTableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 40px;">سلة التسوق فارغة. <a href="products.html">ابدأ التسوق الآن!</a></td></tr>`;
              // Hide order summary or show 0s? Depends on design choice.
             if(subtotalSpan) subtotalSpan.textContent = `0.00 ر.س`;
             if(taxSpan) taxSpan.textContent = `0.00 ر.س`;
             if(grandTotalSpan) grandTotalSpan.textContent = `0.00 ر.س`;
         }
     }

    // Initial calculation of totals when cart page loads
    if (document.body.classList.contains('cart-page') || window.location.pathname.includes('cart.html') ) { // Check if we are on the cart page
        updateCartTotals();

        // Add event listeners to quantity inputs on cart page to update totals on change
         const cartQuantityInputs = document.querySelectorAll('.cart-items .quantity-selector input');
         cartQuantityInputs.forEach(input => {
             input.addEventListener('change', updateCartTotals);
         });
         // Also update on button clicks for quantity
         document.querySelectorAll('.cart-items .quantity-minus, .cart-items .quantity-plus').forEach(button => {
            button.addEventListener('click', () => {
                // Need a slight delay for the input value to potentially update before recalculating
                setTimeout(updateCartTotals, 50);
            });
         });
    }


}); // End DOMContentLoaded