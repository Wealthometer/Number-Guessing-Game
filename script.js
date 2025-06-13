class NumberGuessingGame {
  constructor() {
    this.maxValue = 100
    this.secretNumber = 0
    this.isCorrect = false
    this.attempts = 0
    this.maxAttempts = 10

    this.initializeElements()
    this.bindEvents()
    this.startNewGame()
  }

  initializeElements() {
    this.guessInput = document.getElementById("guessInput")
    this.submitBtn = document.getElementById("submitGuess")
    this.newGameBtn = document.getElementById("newGame")
    this.maxValueSelect = document.getElementById("maxValue")
    this.feedback = document.getElementById("feedback")
    this.attemptsDisplay = document.getElementById("attempts")
    this.rangeDisplay = document.getElementById("range")
    this.progressFill = document.getElementById("progressFill")
  }

  bindEvents() {
    this.submitBtn.addEventListener("click", () => this.makeGuess())
    this.newGameBtn.addEventListener("click", () => this.startNewGame())
    this.maxValueSelect.addEventListener("change", () => this.updateMaxValue())

    this.guessInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.makeGuess()
      }
    })

    this.guessInput.addEventListener("input", () => {
      this.validateInput()
    })
  }

  updateMaxValue() {
    this.maxValue = Number.parseInt(this.maxValueSelect.value)
    this.rangeDisplay.textContent = `1 - ${this.maxValue}`
    this.guessInput.max = this.maxValue
    this.startNewGame()
  }

  startNewGame() {
    // Generate random number between 1 and maxValue
    this.secretNumber = Math.floor(Math.random() * this.maxValue) + 1
    this.isCorrect = false
    this.attempts = 0

    // Reset UI
    this.updateAttempts()
    this.updateProgress()
    this.showFeedback("🤔", "Make your first guess!", "default")
    this.guessInput.value = ""
    this.guessInput.disabled = false
    this.submitBtn.disabled = false

    // Update range display
    this.rangeDisplay.textContent = `1 - ${this.maxValue}`
    this.guessInput.max = this.maxValue

    // Focus input
    this.guessInput.focus()

    // Console log for development (as mentioned in the exercise)
    console.log(`Secret number: ${this.secretNumber}`)
  }

  validateInput() {
    const value = Number.parseInt(this.guessInput.value)
    const isValid = value >= 1 && value <= this.maxValue

    this.submitBtn.disabled = !isValid || this.guessInput.value === ""

    if (this.guessInput.value && !isValid) {
      this.guessInput.style.borderColor = "#dc3545"
    } else {
      this.guessInput.style.borderColor = "#e1e5e9"
    }
  }

  makeGuess() {
    const guess = Number.parseInt(this.guessInput.value)

    // Validate input
    if (isNaN(guess) || guess < 1 || guess > this.maxValue) {
      this.showFeedback("❌", `Please enter a number between 1 and ${this.maxValue}`, "error")
      this.addShakeAnimation()
      return
    }

    this.attempts++
    this.updateAttempts()
    this.updateProgress()

    // Check if guess is correct
    if (guess === this.secretNumber) {
      this.isCorrect = true
      this.handleCorrectGuess()
    } else if (this.attempts >= this.maxAttempts) {
      this.handleGameOver()
    } else {
      this.handleIncorrectGuess(guess)
    }

    this.guessInput.value = ""
    this.guessInput.focus()
  }

  handleCorrectGuess() {
    const messages = [
      "🎉 Congratulations! You got it!",
      "🏆 Amazing! Perfect guess!",
      "⭐ Brilliant! You nailed it!",
      "🎯 Bullseye! Excellent work!",
    ]

    const randomMessage = messages[Math.floor(Math.random() * messages.length)]
    this.showFeedback("🎉", `${randomMessage} The number was ${this.secretNumber}!`, "success")

    this.guessInput.disabled = true
    this.submitBtn.disabled = true
    this.addPulseAnimation()

    // Celebrate with confetti effect
    this.createConfetti()
  }

  handleGameOver() {
    this.showFeedback("😔", `Game Over! The number was ${this.secretNumber}. Try again!`, "error")
    this.guessInput.disabled = true
    this.submitBtn.disabled = true
    this.addShakeAnimation()
  }

  handleIncorrectGuess(guess) {
    let hint = ""
    let icon = ""

    if (guess < this.secretNumber) {
      hint = "Too low! Try a higher number."
      icon = "📈"
    } else {
      hint = "Too high! Try a lower number."
      icon = "📉"
    }

    const remainingAttempts = this.maxAttempts - this.attempts
    const message = `${hint} ${remainingAttempts} attempts left.`

    this.showFeedback(icon, message, "warning")

    if (remainingAttempts <= 3) {
      this.addShakeAnimation()
    }
  }

  showFeedback(icon, message, type) {
    const feedbackIcon = this.feedback.querySelector(".feedback-icon")
    const feedbackText = this.feedback.querySelector("p")

    feedbackIcon.textContent = icon
    feedbackText.textContent = message

    // Remove existing classes
    this.feedback.classList.remove("success", "error", "warning")

    // Add new class if not default
    if (type !== "default") {
      this.feedback.classList.add(type)
    }
  }

  updateAttempts() {
    this.attemptsDisplay.textContent = this.attempts
  }

  updateProgress() {
    const progressPercentage = (this.attempts / this.maxAttempts) * 100
    this.progressFill.style.width = `${progressPercentage}%`

    // Change color based on progress
    if (progressPercentage > 80) {
      this.progressFill.style.background = "linear-gradient(90deg, #dc3545, #c82333)"
    } else if (progressPercentage > 60) {
      this.progressFill.style.background = "linear-gradient(90deg, #ffc107, #e0a800)"
    } else {
      this.progressFill.style.background = "linear-gradient(90deg, #667eea, #764ba2)"
    }
  }

  addShakeAnimation() {
    this.feedback.classList.add("shake")
    setTimeout(() => {
      this.feedback.classList.remove("shake")
    }, 500)
  }

  addPulseAnimation() {
    this.feedback.classList.add("pulse")
    setTimeout(() => {
      this.feedback.classList.remove("pulse")
    }, 600)
  }

  createConfetti() {
    const colors = ["#667eea", "#764ba2", "#f093fb", "#f5576c", "#4facfe", "#00f2fe"]

    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        const confetti = document.createElement("div")
        confetti.style.position = "absolute"
        confetti.style.width = "10px"
        confetti.style.height = "10px"
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
        confetti.style.left = Math.random() * 100 + "%"
        confetti.style.top = "-10px"
        confetti.style.borderRadius = "50%"
        confetti.style.pointerEvents = "none"
        confetti.style.zIndex = "1000"

        document.body.appendChild(confetti)

        const animation = confetti.animate(
          [
            { transform: "translateY(0) rotate(0deg)", opacity: 1 },
            { transform: `translateY(${window.innerHeight + 100}px) rotate(720deg)`, opacity: 0 },
          ],
          {
            duration: 3000,
            easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          },
        )

        animation.onfinish = () => {
          confetti.remove()
        }
      }, i * 100)
    }
  }
}

// Initialize the game when the page loads
document.addEventListener("DOMContentLoaded", () => {
  new NumberGuessingGame()
})

// Add some fun easter eggs
document.addEventListener("keydown", (e) => {
  // Konami code easter egg
  const konamiCode = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "KeyB",
    "KeyA",
  ]
  if (!window.konamiProgress) window.konamiProgress = 0

  if (e.code === konamiCode[window.konamiProgress]) {
    window.konamiProgress++
    if (window.konamiProgress === konamiCode.length) {
      alert("🎮 Konami Code activated! You're a true gamer!")
      window.konamiProgress = 0
    }
  } else {
    window.konamiProgress = 0
  }
})
