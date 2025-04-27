document.addEventListener("DOMContentLoaded", function () {
    const moodButtons = document.querySelectorAll(".mood-btn");
    const saveBtn = document.getElementById("save-btn");
    const messageDiv = document.querySelector(".message");
    const body = document.body;
    const noteField = document.getElementById("note");

    let selectedMood = "";
    
    // 🎶 Background music
    const sounds = {
        "Happy": "happy.mp3",
        "Sad": "sad.mp3",
        "Angry": "angry.mp3",
        "Excited": "excited.mp3",
        "Fear": "fear.mp3"
    };
    const audio = new Audio();

    // 📊 Mood Progress Tracker (Stored in Local Storage)
    let moodCount = JSON.parse(localStorage.getItem("moodTracker")) || {};

    // 😆 Easter Egg: Track Mood Streak
    let lastMood = localStorage.getItem("lastMood") || "";
    let moodStreak = parseInt(localStorage.getItem("moodStreak")) || 0;

    // 🔥 Mood settings: Background color, messages, music
    const moodSettings = {
        "Happy": { color: "#FFD700", message: "😊 Thanks for sharing your happiness!", bgImage: "url('happy-bg.webp')", emoji: "😊" },
        "Sad": { color: "#4682B4", message: "😔 Stay strong, tomorrow is a new day!", bgImage: "url('sad-bg.webp')", emoji: "😢" },
        "Angry": { color: "#B22222", message: "😡 Take a deep breath, everything will be fine.", bgImage: "url('angry-bg.webp')", emoji: "🔥" },
        "Excited": { color: "#FF4500", message: "🤩 Glad to see your excitement!", bgImage: "url('excited-bg.webp')", emoji: "🎉" },
        "Fear": { color: "#708090", message: "😨 Don't worry, you're stronger than you think!", bgImage: "url('fear.webp')", emoji: "💜" }
    };

    // 🌈 Smooth background transition effect
    body.style.transition = "background 1s ease-in-out";
    body.style.backgroundImage = "url('doodle-bg.jpg')";
    messageDiv.innerHTML = "📝 Tell me about your day!";
    messageDiv.classList.remove("hidden");

    // Function to play music
    function playMusic(mood) {
        if (sounds[mood]) {
            audio.src = sounds[mood];
            audio.play();
        }
    }
    let moodChartInstance=null;
    // Function to update progress tracker
    function updateMoodTracker() {
        let trackerCanvas = document.getElementById("moodChart");
        if (!trackerCanvas) {
            trackerCanvas = document.createElement("canvas");
            trackerCanvas.id = "moodChart";
            document.body.appendChild(trackerCanvas);
        }
        
        const ctx = trackerCanvas.getContext("2d");

        if(moodChartInstance){
            moodChartInstance.destroy();
        }
        moodChartInstance=new Chart(ctx, {
            type: "bar",
            data: {
                labels: Object.keys(moodCount),
                datasets: [{
                    label: "Mood Tracker",
                    data: Object.values(moodCount),
                    backgroundColor: ["#FFD700", "#4682B4", "#B22222", "#FF4500", "#708090"]
                }]
            }
        });
    }

    // Handle Mood Selection
    moodButtons.forEach(button => {
        button.addEventListener("click", function () {
            // Remove active class from all buttons
            moodButtons.forEach(btn => btn.classList.remove("active"));
            // Add active class to selected button
            this.classList.add("active");
            selectedMood = this.getAttribute("data-mood");

            // Reset note field when changing mood
            noteField.value = "";

            // Change background with smooth effect
            if (selectedMood in moodSettings) {
                body.style.backgroundImage = moodSettings[selectedMood].bgImage;
                body.style.backgroundColor = moodSettings[selectedMood].color;

                // Play music 🎶
                playMusic(selectedMood);

                // Reset message on mood selection
                messageDiv.innerHTML = "📝 Tell me about your day!";
                messageDiv.classList.remove("hidden");
            }
        });
    });

    // Handle Save Button Click
    saveBtn.addEventListener("click", function () {
        console.log("Save button clicked");
        if (!selectedMood) {
            alert("Please select a mood before saving!");
            return;
        }

        // 📊 Update mood count in local storage
        moodCount[selectedMood] = (moodCount[selectedMood] || 0) + 1;
        localStorage.setItem("moodTracker", JSON.stringify(moodCount));
        updateMoodTracker();

        // 😆 Easter Egg: Check Mood Streak
        if (lastMood === selectedMood) {
            moodStreak++;
        } else {
            moodStreak = 1;
        }
        localStorage.setItem("lastMood", selectedMood);
        localStorage.setItem("moodStreak", moodStreak);

        if (moodStreak === 3) {
            alert("😆 Wow! You're stuck in this mood! Maybe try something new?");
        }
        // ✅ Ensure Message is Shown Properly
        messageDiv.innerHTML = moodSettings[selectedMood].message;
        messageDiv.classList.remove("hidden");
        messageDiv.style.display = "block";  
        messageDiv.style.opacity = "1"; 
    });
    // Load Saved Mood (optional)
    updateMoodTracker();
});
