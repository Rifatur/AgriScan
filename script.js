$(document).ready(function() {
    // File upload handling
    const uploadArea = $('#uploadArea');
    const fileInput = $('#fileInput');
    const imagePreviewContainer = $('#imagePreviewContainer');
    const emptyPreviewContainer = $('#emptyPreviewContainer');
    const imagePreview = $('#imagePreview');
    const analyzeBtn = $('#analyzeBtn');
    const progressContainer = $('#progressContainer');
    const progressBar = $('#progressBar');
    const resultsContainer = $('#resultsContainer');

    // Click to upload - Improved functionality
    uploadArea.on('click', function() {
        fileInput.click();
    });

    // Make the "click to browse" text clickable
    $(document).on('click', '.upload-subtext', function(e) {
        e.stopPropagation(); // Prevent double triggering with the parent click
        fileInput.click();
    });

    // Drag and drop functionality
    uploadArea.on('dragover', function(e) {
        e.preventDefault();
        uploadArea.addClass('active');
    });

    uploadArea.on('dragleave', function() {
        uploadArea.removeClass('active');
    });

    uploadArea.on('drop', function(e) {
        e.preventDefault();
        uploadArea.removeClass('active');

        if (e.originalEvent.dataTransfer.files.length) {
            handleFile(e.originalEvent.dataTransfer.files[0]);
        }
    });

    // File input change
    fileInput.on('change', function() {
        if (this.files.length) {
            handleFile(this.files[0]);
        }
    });

    // Handle file selection
    function handleFile(file) {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();

            reader.onload = function(e) {
                imagePreview.attr('src', e.target.result);
                imagePreviewContainer.show();
                emptyPreviewContainer.hide();
                analyzeBtn.prop('disabled', false);
            };

            reader.readAsDataURL(file);
        } else {
            alert('Please select an image file.');
        }
    }

    // Analyze button click
    analyzeBtn.on('click', function() {
        // Show progress
        progressContainer.show();
        resultsContainer.hide();
        analyzeBtn.prop('disabled', true);

        // Simulate progress
        let progress = 0;
        const interval = setInterval(function() {
            progress += 5;
            progressBar.css('width', progress + '%');

            if (progress >= 100) {
                clearInterval(interval);

                // Show results after a short delay
                setTimeout(function() {
                    progressContainer.hide();
                    resultsContainer.show();

                    // Set result image
                    $('#resultImagePreview').attr('src', imagePreview.attr('src'));

                    // Animate confidence circle
                    const confidence = 87; // Example confidence value
                    animateConfidenceCircle(confidence);

                    // Reset analyze button
                    analyzeBtn.prop('disabled', false);
                }, 500);
            }
        }, 100);
    });

    // Animate confidence circle
    function animateConfidenceCircle(confidence) {
        const circle = $('#confidenceCircle');
        const text = $('#confidenceText');

        // Calculate dash offset based on confidence
        const circumference = 2 * Math.PI * 54;
        const offset = circumference - (confidence / 100) * circumference;

        // Animate the circle
        setTimeout(function() {
            circle.css('stroke-dashoffset', offset);

            // Animate the text
            let current = 0;
            const increment = confidence / 50;
            const timer = setInterval(function() {
                current += increment;
                if (current >= confidence) {
                    current = confidence;
                    clearInterval(timer);
                }
                text.text(Math.round(current) + '%');
            }, 20);
        }, 300);
    }
});