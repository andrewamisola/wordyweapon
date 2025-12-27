  const hasTalent=(id)=>S.talents.includes(id);

  if(lastResult.win){
    // === ULTIMATE WEAPON VICTORY - SPECIAL HANDLING ===
    // If Ultimate Weapon was forged, treat it as a complete run victory (like Round 18)
    if(lastResult.ultimateWeaponForged){
      S.wins++;S.streak++;

      // Mark this as a full victory - same stats tracking as Round 18 completion
      PStats.victories++;
      if(S.hero && S.hero.name) PStats.heroClears[S.hero.name]=true;

      // Track difficulty clears per hero for unlocking harder modes
      if(!PStats.heroDifficultyClears) PStats.heroDifficultyClears = {};
      const heroName = S.hero.name;
      if(!PStats.heroDifficultyClears[heroName]) PStats.heroDifficultyClears[heroName] = {};
      const diff = S.difficulty || 0;
      PStats.heroDifficultyClears[heroName][diff] = (PStats.heroDifficultyClears[heroName][diff] || 0) + 1;

      // Track global difficulty clears for achievements
      if(!PStats.difficultyClears) PStats.difficultyClears = {};
      PStats.difficultyClears[diff] = (PStats.difficultyClears[diff] || 0) + 1;

      // Track highest round reached
      const currentRound = S.roundIndex - 1;
      if(!PStats.highestRound || currentRound > PStats.highestRound){
        PStats.highestRound = currentRound;
      }

      saveStats();
      checkAndUnlockAchievements();

      // Award XP to hero for completing the run (with boss bonus for ultimate achievement)
      if(S.hero && S.hero.name){
        const xpGained = calcRunXP(S.roundIndex, true); // true = defeated boss equivalent
        const result = awardHeroXP(S.hero.name, xpGained);
        S.lastRunXP = { xp: xpGained, ...result };
      }

      // Clear run save - the run is complete
      clearRunSave();
      S.heroSelected = false;

      // Show a special Ultimate Weapon celebration
      // Use the chapter celebration overlay with custom text for Ultimate Weapon
      const titleEl = document.getElementById('chapter-title');
      const goldWrapper = document.getElementById('chapter-gold-wrapper');
      const dialogueEl = document.getElementById('chapter-hero-dialogue');
      const continueBtn = document.getElementById('chapter-continue-btn');
      const mainMenuBtn = document.getElementById('chapter-mainmenu-btn');
      const portraitEl = document.getElementById('chapter-hero-portrait');
      const heroNameEl = document.getElementById('chapter-hero-name');
      const godRaysEl = document.getElementById('chapter-god-rays');
      const modalEl = document.querySelector('#chapter-overlay .chapter-modal');

      // Customize for Ultimate Weapon
      if(titleEl) titleEl.innerHTML = '<span class="mod-badge ultimate">ULTIMATE WEAPON FORGED!</span>';
      if(goldWrapper) goldWrapper.style.display = 'none'; // No gold bonus display needed

      // Show hero portrait
      if(portraitEl && S.hero){
        portraitEl.innerHTML = getPortraitSVG(S.hero.portrait || S.hero.name);
        portraitEl.classList.add('show');
      }

      // Show hero name
      if(heroNameEl && S.hero){
        heroNameEl.textContent = S.hero.name;
        heroNameEl.classList.add('show');
      }

      // Epic dialogue for Ultimate Weapon achievement
      if(dialogueEl){
        dialogueEl.textContent = '"The ultimate power... achieved through perfect word mastery. The lexicon itself bends to your will."';
      }

      // Add rainbow effects
      if(godRaysEl) godRaysEl.classList.add('rainbow');
      if(modalEl) modalEl.classList.add('rainbow');

      // Epic celebration sparks!
      pulseFlame();
      burstSparks(window.innerWidth / 2, window.innerHeight / 2, 100, ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff', '#5f27cd'], true);
      // Multiple waves of celebration
      setTimeout(() => {
        burstSparks(window.innerWidth / 2 - 150, window.innerHeight / 2, 60, ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff', '#5f27cd'], true);
        burstSparks(window.innerWidth / 2 + 150, window.innerHeight / 2, 60, ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff', '#5f27cd'], true);
      }, 200);
      setTimeout(() => {
        burstSparks(window.innerWidth / 2, window.innerHeight / 2 - 100, 60, ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff', '#5f27cd'], true);
        burstSparks(window.innerWidth / 2, window.innerHeight / 2 + 100, 60, ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff', '#5f27cd'], true);
      }, 400);

      // Show main menu button only (no continue to endless)
      if(continueBtn) continueBtn.style.display = 'none';
      if(mainMenuBtn) {
        mainMenuBtn.classList.add('show');
        mainMenuBtn.textContent = 'RETURN TO MAIN MENU';
      }

      // Trigger victory music effect
      if(musicEngine && musicEngine.initialized){
        musicEngine.triggerVictoryEffect();
      }

      // Play celebration sound
      try { playSample('rarity.ogg', 1.0); } catch(e){}

      // Show the overlay
      const overlay = document.getElementById('chapter-overlay');
      if(overlay){
        overlay.classList.remove('show');
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            overlay.classList.add('show');
            overlay.focus?.();
          });
        });
      }

      // Wait for user to return to main menu
      await new Promise((resolve) => {
        if(mainMenuBtn){
          mainMenuBtn.onclick = async () => {
            if(isTransitioning) return;
            playSample('click.ogg', 0.8);
            // Unified transition: hide celebration AND show main menu at peak
            await playSceneTransition(() => {
              overlay.classList.remove('show');
              // Clean up rainbow classes and show states
              if(godRaysEl) godRaysEl.classList.remove('rainbow');
              if(modalEl) modalEl.classList.remove('rainbow');
              if(portraitEl) portraitEl.classList.remove('show');
              if(heroNameEl) heroNameEl.classList.remove('show');
              if(continueBtn) continueBtn.style.display = '';
              mainMenuBtn.classList.remove('show');
              // Go back to main menu
              showMainMenu();
            });
            resolve();
          };
          mainMenuBtn.onmouseenter = sfxHover;
        }
      });

      return; // END - Ultimate Weapon victory handled, don't continue to normal flow
    }

    // Victory: level up, gain gold, proceed
    S.wins++;S.streak++;
