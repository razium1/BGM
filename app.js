class Fighter {
    constructor(name, strength, agility, stamina, punchPower, defense, speed, mentalToughness, signingFee) {
      this.name = name;
      this.strength = strength;
      this.agility = agility;
      this.stamina = stamina;
      this.punchPower = punchPower;
      this.defense = defense;
      this.speed = speed;
      this.mentalToughness = mentalToughness;
      this.signingFee = signingFee;
      this.winCount = 0;
      this.lossCount = 0;
      this.fatigue = 0;
      this.injured = false;
      this.morale = 100;
    }
  
    train() {
      if (!this.injured) {
        this.strength += Math.random() * 0.5;
        this.agility += Math.random() * 0.5;
        this.stamina += Math.random() * 0.5;
        this.punchPower += Math.random() * 0.5;
        this.defense += Math.random() * 0.5;
        this.speed += Math.random() * 0.5;
        this.mentalToughness += Math.random() * 0.5;
        this.fatigue += Math.random() * 10;
        if (this.fatigue > 100) {
          this.injured = true;
          this.morale -= 20;
          alert(`${this.name} is injured due to fatigue!`);
        }
      }
    }
  }
  
  let gym;
  let fighterNamesData;
  let fighterOptions = [];
  let fightCalendar = [];  // Calendar to store scheduled fights
  
  // Load fighter names from JSON file
  fetch('fighter_names.json')
    .then(response => response.json())
    .then(data => {
      fighterNamesData = data;
      startNewGame();
    });
  
  class Gym {
    constructor() {
      this.name = "Champion Boxing Gym";
      this.fighters = [];
      this.money = 50000;
      this.expenses = 10000;
      this.sponsorshipRevenue = 0;
      this.reputation = 0;
      this.week = 1;
      this.month = 1;
    }
  
    signFighter(fighter) {
      if (fighter.signingFee <= this.money) {
        this.fighters.push(fighter);
        this.money -= fighter.signingFee;
        updateUI();
      } else {
        alert("Not enough money to sign this fighter.");
      }
    }
  
    trainFighters() {
      this.fighters.forEach(fighter => fighter.train());
      updateUI();
      alert("Your fighters have been trained!");
    }
  
    manageExpenses() {
      this.money -= this.expenses;
      this.money += this.sponsorshipRevenue;
      updateUI();
      if (this.money < 0) {
        alert("You're running out of money!");
      }
    }
  
    progressWeek() {
      this.week++;
      if (this.week > 4) {
        this.month++;
        this.week = 1;
      }
  
      // Automatically conduct any scheduled fights
      this.simulateScheduledFights();
      updateUI();
    }
  
    scheduleFight(fighter1, fighter2, week, month) {
      fightCalendar.push({
        fighter1,
        fighter2,
        week,
        month
      });
      alert(`Fight between ${fighter1.name} and ${fighter2.name} scheduled for Week ${week}, Month ${month}.`);
      updateUI();
    }
  
    simulateScheduledFights() {
      const currentWeek = this.week;
      const currentMonth = this.month;
  
      fightCalendar = fightCalendar.filter(fight => {
        if (fight.week === currentWeek && fight.month === currentMonth) {
          const winner = fightSimulation(fight.fighter1, fight.fighter2);
          this.reputation += 10;
          alert(`Fight between ${fight.fighter1.name} and ${fight.fighter2.name} has taken place. The winner is ${winner.name}!`);
          return false; // Remove fight from calendar
        }
        return true;
      });
      displayUpcomingFights(); // Update upcoming fights section
    }
  
    canBookFighter(fighter, week, month) {
      return !fightCalendar.some(fight => fight.fighter1.name === fighter.name && fight.week === week && fight.month === month);
    }
  }
  
  // Create global functions for button actions
  function trainFighters() {
    gym.trainFighters();
  }
  
  function manageExpenses() {
    gym.manageExpenses();
  }
  
  function progressWeek() {
    gym.progressWeek();
  }
  
  function updateUI() {
    document.getElementById("money").innerText = gym.money;
    document.getElementById("expenses").innerText = gym.expenses;
    document.getElementById("week").innerText = gym.week;
    document.getElementById("month").innerText = gym.month;
    document.getElementById("sponsorshipRevenue").innerText = gym.sponsorshipRevenue;
    document.getElementById("reputation").innerText = gym.reputation;
  
    const fighterContainer = document.getElementById("fighters");
    fighterContainer.innerHTML = '';
  
    gym.fighters.forEach(fighter => {
      const fighterCard = document.createElement('div');
      fighterCard.className = 'col-md-4 fighter-card';
      fighterCard.innerHTML = `
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">${fighter.name}</h5>
            <p>Strength: ${fighter.strength.toFixed(2)}</p>
            <p>Agility: ${fighter.agility.toFixed(2)}</p>
            <p>Stamina: ${fighter.stamina.toFixed(2)}</p>
            <p>Punch Power: ${fighter.punchPower.toFixed(2)}</p>
            <p>Defense: ${fighter.defense.toFixed(2)}</p>
            <p>Speed: ${fighter.speed.toFixed(2)}</p>
            <p>Mental Toughness: ${fighter.mentalToughness.toFixed(2)}</p>
            <p>Wins: ${fighter.winCount}, Losses: ${fighter.lossCount}</p>
            <p>Fatigue: ${fighter.fatigue.toFixed(2)}</p>
            <p>Morale: ${fighter.morale.toFixed(2)}</p>
          </div>
        </div>
      `;
      fighterContainer.appendChild(fighterCard);
    });
  
    const fighter1Dropdown = document.getElementById("fighter1");
    fighter1Dropdown.innerHTML = '';
  
    gym.fighters.forEach(fighter => {
      const option = document.createElement('option');
      option.value = fighter.name;
      option.innerText = fighter.name;
      fighter1Dropdown.appendChild(option);
    });
  
    displayUpcomingFights(); // Display the upcoming fights
  }
  
  // Display the list of upcoming fights
  function displayUpcomingFights() {
    const upcomingFightsDiv = document.getElementById('upcomingFights');
    upcomingFightsDiv.innerHTML = '';
  
    fightCalendar.forEach(fight => {
      const fightDetails = `
        <div>
          <p><strong>${fight.fighter1.name}</strong> vs <strong>${fight.fighter2.name}</strong></p>
          <p>Scheduled for Week ${fight.week}, Month ${fight.month}</p>
        </div>
        <hr>
      `;
      upcomingFightsDiv.innerHTML += fightDetails;
    });
  }
  
  // Function to show booking options
  function showBookingOptions() {
    const fighter1Name = document.getElementById("fighter1").value;
    const fighter1 = gym.fighters.find(fighter => fighter.name === fighter1Name);
  
    const modalBody = document.getElementById('bookingOptions');
    modalBody.innerHTML = '';
  
    for (let i = 1; i <= 4; i++) {
      const week = (gym.week + i) % 4 === 0 ? 4 : (gym.week + i) % 4;
      const month = gym.week + i > 4 ? gym.month + 1 : gym.month;
      if (gym.canBookFighter(fighter1, week, month)) {
        modalBody.innerHTML += `<button class="btn btn-primary" onclick="scheduleFightOnDate(${week}, ${month})">Week ${week}, Month ${month}</button>`;
      }
    }
  
    document.getElementById('bookingModal').classList.add('show');
    document.getElementById('bookingModal').style.display = 'block';
  }
  
  // Schedule the fight based on the selected date
  function scheduleFightOnDate(week, month) {
    const fighter1Name = document.getElementById("fighter1").value;
    const fighter1 = gym.fighters.find(fighter => fighter.name === fighter1Name);
    const randomOpponent = generateRandomOpponent();
  
    gym.scheduleFight(fighter1, randomOpponent, week, month);
    closeBookingModal();
  }
  
  function closeBookingModal() {
    document.getElementById('bookingModal').classList.remove('show');
    document.getElementById('bookingModal').style.display = 'none';
  }
  
  // Show the fighter signing modal
  function showSignFighterOptions() {
    fighterOptions = generateFighterOptions();  // Store options in a global array
    const modalBody = document.getElementById('fighterOptions');
    
    modalBody.innerHTML = fighterOptions.map((option, index) => `
      <div class="fighter-option">
        <p>Name: ${option.name}</p>
        <p>Strength: ${option.strength.toFixed(2)}</p>
        <p>Agility: ${option.agility.toFixed(2)}</p>
        <p>Stamina: ${option.stamina.toFixed(2)}</p>
        <p>Signing Fee: $${option.signingFee}</p>
        <button class="btn btn-primary" onclick="signFighterOption(${index})">Sign ${option.name}</button>
      </div>
      <hr>
    `).join('');
    
    document.getElementById('signFighterModal').classList.add('show');
    document.getElementById('signFighterModal').style.display = 'block';
  }
  
  // Sign the selected fighter
  function signFighterOption(index) {
    const fighter = fighterOptions[index];
    gym.signFighter(fighter);
    closeSignFighterModal();
  }
  
  // Close the modal without signing a fighter
  function closeSignFighterModal() {
    document.getElementById('signFighterModal').classList.remove('show');
    document.getElementById('signFighterModal').style.display = 'none';
  }
  
  // Generate random fighter options for signing
  function generateFighterOptions() {
    const options = [];
    for (let i = 0; i < 3; i++) {
      const firstName = fighterNamesData.firstNames[Math.floor(Math.random() * fighterNamesData.firstNames.length)];
      const lastName = fighterNamesData.lastNames[Math.floor(Math.random() * fighterNamesData.lastNames.length)];
      const name = `${firstName} ${lastName}`;
      const strength = Math.random() * 100;
      const agility = Math.random() * 100;
      const stamina = Math.random() * 100;
      const signingFee = Math.round((strength + agility + stamina) * 50);
      const fighter = new Fighter(name, strength, agility, stamina, Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100, signingFee);
      options.push(fighter);
    }
    return options;
  }
  
  // Function to generate a random opponent
  function generateRandomOpponent() {
    const firstName = fighterNamesData.firstNames[Math.floor(Math.random() * fighterNamesData.firstNames.length)];
    const lastName = fighterNamesData.lastNames[Math.floor(Math.random() * fighterNamesData.lastNames.length)];
    const name = `${firstName} ${lastName}`;
    const strength = Math.random() * 100;
    const agility = Math.random() * 100;
    const stamina = Math.random() * 100;
    const punchPower = Math.random() * 100;
    const defense = Math.random() * 100;
    const speed = Math.random() * 100;
    const mentalToughness = Math.random() * 100;
    return new Fighter(name, strength, agility, stamina, punchPower, defense, speed, mentalToughness, 0);
  }
  
  function fightSimulation(fighter1, fighter2) {
    const fighter1Score = fighter1.strength + fighter1.agility + fighter1.stamina + fighter1.punchPower + fighter1.defense + fighter1.speed + fighter1.mentalToughness;
    const fighter2Score = fighter2.strength + fighter2.agility + fighter2.stamina + fighter2.punchPower + fighter2.defense + fighter2.speed + fighter2.mentalToughness;
  
    const totalScore = fighter1Score + fighter2Score;
    const result = Math.random() * totalScore;
  
    if (result <= fighter1Score) {
      fighter1.winCount++;
      fighter2.lossCount++;
      return fighter1;
    } else {
      fighter2.winCount++;
      fighter1.lossCount++;
      return fighter2;
    }
  }
  
  function startNewGame() {
    gym = new Gym();
    updateUI();
  }
  