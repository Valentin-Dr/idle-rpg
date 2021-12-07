// Stats du joueur
let player = {
    defense: 0,
    attack: 3,
    gold: 0,
    gems: 0,
    stage: 1,
    artifacts: 0,
    atkSpeed: 500,
    critical: 0,
    criticalDmg: 1.5,
}

let enemies = {
    // TODO rajouter name et stats à chaque nouvel ennemi
    names: [
        'cub',
        'thundercub',
        // 'cultist',
    ],
    cub: {
        originalHp: 30,
        maxHp: 30,
        hp: 30,
        originalReward: 8,
        reward: 8,
    },

    thundercub: {
        originalHp: 25,
        maxHp: 25,
        hp: 25,
        originalReward: 6,
        reward: 6,
    },

    // cultist: {
    //     maxHp : 500,
    //     hp: 500,
    //     reward: 500,
    // }
}

let bosses = {
    names: [
        'cultist',
    ],
    cultist: {
        maxHp: undefined,
        hp: undefined,
        reward: 500,
    }
}

let pets = [
    testPet = {
        name: 'testPet',
        cost: 3000,
        // Il donne de l'attaque
        attack: 0,
        atkSpeed: 0,
        critical: 0,
        criticalDmg: 0,
        killCount: 0,
        upgrade: 20,
    },

    secondPet = {
        name: 'secondPet',
        cost: 150000,
        attack: 0,
        atkSpeed: 0,
        // Il donne du critique
        critical: 0,
        criticalDmg: 0,
        killCount: 0,
        upgrade: 300,
    },
]
// Compteurs
let STRcount = 0;
let killedEnemies = 0;
let isPetEquipped = false;
let equippedPet;
let allowedRebirth = false;

// Selectors
const getPetModal = document.querySelector('.open-pets-modale');
const getAllPets = document.querySelectorAll('.cell');
const getCurrentPet = document.getElementById('pet');
const getCurrentPetKillLeft = document.querySelector('.currentPetKillLeft');
const getCurrentPetEffect = document.querySelector('.currentPetEffect');
const getStageDiv = document.querySelector('.stage');
const stageDivP = getStageDiv.querySelectorAll('p');
const getAutoStageButton = document.querySelector('.autoStage');
const modale = document.querySelector('.pets-modale');
const tooltip = document.querySelectorAll('.petTooltip');
const getSaveNotif = document.querySelector('.autosave');
const getSettingsButton = document.querySelector('.open-settings-modale');
const getSettingsModale = document.querySelector('.settings-modale');
const getRebirthModaleButton = document.querySelector('.open-rebirth-modale');
const getRebirthModale = document.querySelector('.rebirth-modale');
const getRebirthButton = document.querySelector('.rebirth');
const getEnemy = document.getElementById('enemy');
const getCrit = document.querySelector('.crit-alert');
const getPlayer = document.getElementById('player');
const getStage = document.getElementById('stage');
const getGold = document.getElementById('gold');
const getKilledEnemies = document.getElementById('stage-count');
const fightingEnemy = document.getElementById('foe');
const fightingEnemyHealth = document.getElementById('foe-health');
const getTimer = document.getElementById('timer');
let currentEnemy;
let currentEnemyHealth;
let gemCount = 0;
let timerLeft;
let autoStage = false;

// Upgrades Selectors
const upgrades = document.querySelectorAll('.upgrade');
const upgradeScreen = document.querySelector('.upgrades');
const currentSTR = document.getElementById('strength');
const currentSTRCost = document.getElementById('strength-cost');
const currentAtkSpeed = document.getElementById('atk-speed');
const currentAtkSpeedCost = document.getElementById('atk-speed-cost');
const currentCrit = document.getElementById('critical');
const currentCritCost = document.getElementById('critical-cost');
const currentCritDmg = document.getElementById('critical-dmg');
const currentCritDmgCost = document.getElementById('critical-dmg-cost');

// Pets Selectors
const petName = document.querySelectorAll('.petName');
const petCost = document.querySelectorAll('.petCost');

// Je remplis mes cases, nécessaire au lancement du jeu
// après ça se fait tout seul
const fillSkills = () => {
    currentSTR.textContent = player.attack;
    currentSTRCost.textContent = upgradesList.strengthUp.cost;
    currentAtkSpeed.textContent = player.atkSpeed;
    currentAtkSpeedCost.textContent = upgradesList.atkSpeed.cost;
    currentCrit.textContent = player.critical;
    currentCritCost.textContent = upgradesList.critical.cost;
    currentCritDmg.textContent = player.criticalDmg;
    currentCritDmgCost.textContent = upgradesList.criticalDmg.cost;
    getKilledEnemies.textContent = killedEnemies;
    getStage.textContent = player.stage;
    getGold.textContent = player.gold;
    if (autoStage) {
        getAutoStageButton.style.color = 'green';
    };
};
fillSkills();

// Je remplis les cases des pets dans la modale Familiers
for (let i = 0; i < petName.length; i++) {
    petName[i].textContent = pets[i].name;
    petCost[i].textContent = pets[i].cost;
};

const save = () => {
    localStorage.setItem('player', JSON.stringify(player));
    localStorage.setItem('enemies', JSON.stringify(enemies));
    localStorage.setItem('upgradesList', JSON.stringify(upgradesList));
    localStorage.setItem('pets', JSON.stringify(pets));
    localStorage.setItem('autoStage', JSON.stringify(autoStage));
};

const load = () => {
    player = JSON.parse(localStorage.getItem('player'));
    enemies = JSON.parse(localStorage.getItem('enemies'));
    upgradesList = JSON.parse(localStorage.getItem('upgradesList'));
    pets = JSON.parse(localStorage.getItem('pets'));
    autoStage = JSON.parse(localStorage.getItem('autoStage'));
    fillSkills();
};

// Si le joueur a déjà une sauvegarde, la charge
if (localStorage.getItem('player')) {
    load();
    fillSkills();
    for (let i = 0; i < petName.length; i++) {
        petName[i].textContent = pets[i].name;
        petCost[i].textContent = pets[i].cost;
    };
};

const destroySave = () => {
    localStorage.removeItem('player');
    localStorage.removeItem('enemies');
    localStorage.removeItem('upgradesList');
    localStorage.removeItem('pets');
};

const getRandomNum = () => {
    const min = 0;
    const max = enemies.names.length;
    return Math.floor(Math.random() * (max - min)) + min;
};

const getRandomAnim = () => {
    const min = 1;
    const max = 4; // 3 en vrai
    return Math.floor(Math.random() * (max - min)) + min;
}

const critChance = () => {
    const min = 1;
    const max = 100;
    return Math.floor(Math.random() * (max - min)) + min;
};

const moveTooltip = (e) => {
    for (let i = tooltip.length; i--;) {
        tooltip[i].style.left = e.pageX + 'px';
        tooltip[i].style.toUpperCase = e.pageY + 'px';

    };
};

// Fonction pour les COMBATS
const fightFunction = () => {
    // Je vais chercher les infos du monstre à l'écran
    enemies.names.forEach(enemy => {
        if (getEnemy.classList.contains(enemy)) {
            currentEnemy = enemy;

            for (const foe in enemies) {
                if (currentEnemy == foe) {
                    const aliveOrDead = document.querySelector(`.${currentEnemy}`);

                    // J'affiche sa vie à l'écran
                    fightingEnemyHealth.textContent = `${enemies[foe].hp}`;

                    // Quand l'ennemi meurt
                    if (enemies[foe].hp <= 0) {
                        aliveOrDead.classList.replace(`${currentEnemy}`, `${currentEnemy}-death`);
                        // Je mets à 0 la vie du monstre plutôt qu'un ' -x '
                        fightingEnemyHealth.textContent = `0`;

                        // Augmente le killcount des familiers
                        if (isPetEquipped) {
                            upgradePet(equippedPet);
                        }

                        // Compteur pour le stage
                        if (killedEnemies < 9) {
                            killedEnemies++;
                        } else {
                            // // Chaque stage, augmente de 10% la vie du monstre
                            // // et ses rewards
                            // for (const enemy in enemies) {
                            //     // enemies[enemy].maxHp = Math.round(enemies[enemy].maxHp * 1.10);
                            //     // enemies[enemy].reward = Math.round(enemies[enemy].reward * 1.10);
                            //     enemies[enemy].maxHp = Math.round(enemies[enemy].maxHp + player.stage);
                            //     enemies[enemy].reward = Math.round(enemies[enemy].reward + player.stage);
                            // }
                            // player.stage++;
                            // killedEnemies = 0;
                            nextStage();
                        }
                        getKilledEnemies.textContent = killedEnemies;
                        setTimeout(() => {
                            // Mets un ennemi aléatoire après la mort du monstre, dépendant de l'atk speed du joueur
                            aliveOrDead.classList.replace(`${currentEnemy}-death`, `${enemies.names[getRandomNum()]}`);
                        }, player.atkSpeed);

                        player.gold += enemies[foe].reward;
                        enemies[foe].hp = enemies[foe].maxHp;
                        // En cas de critique, deal plus de dégâts selon le niveau du critical damage
                        // et affiche un message ' CRIT '
                    } else if (critChance() <= player.critical) {
                        enemies[foe].hp -= player.attack * player.criticalDmg;
                        getCrit.classList.remove('hidden');
                        setTimeout(() => {
                            getCrit.classList.add('hidden');
                        }, player.atkSpeed);
                    } else {
                        enemies[foe].hp -= player.attack;
                        // Animation random après l'attaque
                        getPlayer.className = '';
                        getPlayer.className = `attack${getRandomAnim()}`;
                        if (getPlayer.className == 'attack3') {
                            getPlayer.style['animation'] = `playerLong ${player.atkSpeed}ms steps(11) infinite`;
                        } else {
                            getPlayer.style['animation'] = `player ${player.atkSpeed}ms steps(6) infinite`;
                        };
                    };
                };
            };
        };
    });

    // Update des stats
    fightingEnemy.textContent = currentEnemy.toUpperCase();
    getStage.textContent = player.stage;
    getGold.textContent = player.gold;
}

// Pour passer les stages, en fonction de si le bouton passer auto
// est activé ou non
const nextStage = () => {
    getEnemy.className = '';
    getPlayer.className = '';
    getPlayer.style.animation = ''
    getPlayer.className = 'idle';
    clearInterval(fighting);
    stageDivP[0].classList.add('hidden');
    if (!autoStage) {
        getStageDiv.addEventListener('click', function nextStage() {
            for (const enemy in enemies) {
                // enemies[enemy].maxHp = Math.round(enemies[enemy].maxHp * 1.10);
                // enemies[enemy].reward = Math.round(enemies[enemy].reward * 1.10);
                enemies[enemy].maxHp = Math.round(enemies[enemy].maxHp + player.stage);
                enemies[enemy].reward = Math.round(enemies[enemy].reward + player.stage);
            };
            getEnemy.className = 'cub';
            stageDivP[0].classList.remove('hidden');
            stageDivP[1].textContent = '';
            getAutoStageButton.classList.remove('hidden');
            player.stage++;
            killedEnemies = 0;
            getKilledEnemies.textContent = killedEnemies;
            fighting = setInterval(fightFunction, player.atkSpeed);
            getStageDiv.removeEventListener('click', nextStage);
        });
        stageDivP[1].textContent = `Passer le stage`;
        getAutoStageButton.classList.add('hidden');
    } else {
        let timer = 5;
        getAutoStageButton.classList.add('hidden');
        stageDivP[1].textContent = `Passer le stage auto dans ${timer}`;
        const stageInterval = setInterval(() => {
            if (timer !== 1) {
                timer--;
                stageDivP[1].textContent = `Passer le stage auto dans ${timer}`;
            } else {
                for (const enemy in enemies) {
                    // enemies[enemy].maxHp = Math.round(enemies[enemy].maxHp * 1.10);
                    // enemies[enemy].reward = Math.round(enemies[enemy].reward * 1.10);
                    enemies[enemy].maxHp = Math.round(enemies[enemy].maxHp + player.stage);
                    enemies[enemy].reward = Math.round(enemies[enemy].reward + player.stage);
                };
                getEnemy.className = 'cub';
                stageDivP[0].classList.remove('hidden');
                stageDivP[1].textContent = '';
                player.stage++;
                killedEnemies = 0;
                getKilledEnemies.textContent = killedEnemies;
                getAutoStageButton.classList.remove('hidden');
                clearInterval(stageInterval);
                fighting = setInterval(fightFunction, player.atkSpeed);
                getStageDiv.removeEventListener('click', nextStage);
            }
        }, 1000);
    }
};

// Pour l'event du bouton pour passer les stages auto
const nextStageAuto = (e) => {
    if (!autoStage) {
        e.target.style.color = 'green';
        autoStage = true;
    } else {
        e.target.style.color = 'red';
        autoStage = false;
    }
}

const fightBoss = (boss) => {
    //***************************************************************/
    getStageDiv.classList.add('hidden');
    // Je mets la classe du boss sur mon ennemi
    getEnemy.className = boss;
    bosses.names.forEach(boss => {
        if (getEnemy.classList.contains(boss)) {
            currentEnemy = boss;

            for (const foe in bosses) {
                if (currentEnemy == foe) {
                    const aliveOrDead = document.querySelector(`.${currentEnemy}`);

                    if (bosses[foe].maxHp === undefined) {
                        bosses[foe].maxHp = enemies.cub.maxHp * 30;
                        bosses[foe].hp = bosses[foe].maxHp;
                    }

                    // J'affiche sa vie à l'écran
                    fightingEnemyHealth.textContent = `${bosses[foe].hp}`;

                    // Quand le boss meurt
                    if (bosses[foe].hp <= 0) {
                        // J'enlève le timer
                        clearInterval(timerLeft);
                        // Remets à 0 le nbr de monstres tués pour le stage
                        killedEnemies = 0;
                        getTimer.classList.add('hidden');

                        aliveOrDead.classList.replace(`${currentEnemy}`, `${currentEnemy}-death`);
                        // Mets le joueur en animation idle
                        getPlayer.className = '';
                        getPlayer.style.animation = ''
                        getPlayer.className = 'idle';
                        // Je mets à 0 la vie du monstre plutôt qu'un ' -x '
                        fightingEnemyHealth.textContent = `0`;

                        setTimeout(() => {
                            upgradeScreen.classList.remove('hidden');
                            getStageDiv.classList.remove('hidden');
                            rebirth();
                        }, 3000);

                        // Augmente le killcount des familiers
                        if (isPetEquipped) {
                            upgradePet(equippedPet);
                        }

                        // // Compteur pour le stage
                        // if (killedEnemies < 9) {
                        //     killedEnemies++;
                        // } else {
                        //     // Chaque stage, augmente de 10% la vie du monstre
                        //     // et ses rewards
                        //     for (const enemy in enemies) {
                        //         enemies[enemy].maxHp = Math.round(enemies[enemy].maxHp * 1.10);
                        //         enemies[enemy].reward = Math.round(enemies[enemy].reward * 1.10);
                        //     }
                        //     player.stage++;
                        //     killedEnemies = 0;
                        // }
                        // getKilledEnemies.textContent = killedEnemies;
                        // setTimeout(() => {
                        //     // Mets un ennemi aléatoire après la mort du monstre, dépendant de l'atk speed du joueur
                        //     aliveOrDead.classList.replace(`${currentEnemy}-death`, `${enemies.names[getRandomNum()]}`);
                        // }, player.atkSpeed);

                        // player.gold += enemies[foe].reward;
                        // enemies[foe].hp = enemies[foe].maxHp;
                        // En cas de critique, deal plus de dégâts selon le niveau du critical damage
                        // et affiche un message ' CRIT '
                    } else if (critChance() <= player.critical) {
                        bosses[foe].hp -= player.attack * player.criticalDmg;
                        getCrit.classList.remove('hidden');
                        setTimeout(() => {
                            getCrit.classList.add('hidden');
                        }, player.atkSpeed);
                    } else {
                        bosses[foe].hp -= player.attack;
                        // Animation random après l'attaque
                        getPlayer.className = '';
                        getPlayer.className = `attack${getRandomAnim()}`;
                        if (getPlayer.className == 'attack3') {
                            getPlayer.style['animation'] = `playerLong ${player.atkSpeed}ms steps(11) infinite`;
                        } else {
                            getPlayer.style['animation'] = `player ${player.atkSpeed}ms steps(6) infinite`;
                        };
                    };
                };
            };
        };
    })
    //***************************************************************/
    // Update du nom
    fightingEnemy.textContent = currentEnemy.toUpperCase();
}

// Core part of the game (fighting)
let fighting = setInterval(fightFunction, player.atkSpeed);

// Fonction pour les upgrades
const upgrade = (e) => {
    // FORCE
    if (e.target.classList.contains('strength')) {
        if (player.gold >= upgradesList.strengthUp.cost) {

            STRcount++;
            // Augmente la force d'un point de + tous les 10 upgrades
            if (STRcount >= 10) {
                upgradesList.strengthUp.effect++;
                STRcount = 0;
            }
            player.gold -= upgradesList.strengthUp.cost;
            player.attack += upgradesList.strengthUp.effect;

            upgradesList.strengthUp.cost = Math.round(upgradesList.strengthUp.cost * 1.40);

            getGold.textContent = player.gold;
            currentSTR.textContent = player.attack;
            currentSTRCost.textContent = upgradesList.strengthUp.cost;
        }
        // VITESSE D'ATTAQUE
    } else if (e.target.classList.contains('atk-speed')) {
        if (player.gold >= upgradesList.atkSpeed.cost && player.atkSpeed > 100) {
            player.gold -= upgradesList.atkSpeed.cost;
            player.atkSpeed -= upgradesList.atkSpeed.effect;

            upgradesList.atkSpeed.cost = Math.round(upgradesList.atkSpeed.cost * 1.80);

            currentAtkSpeed.textContent = player.atkSpeed;
            currentAtkSpeedCost.textContent = upgradesList.atkSpeed.cost;
            // Accélère l'animation de l'attaque du joueur
            getPlayer.style['animation'] = `player ${player.atkSpeed}ms steps(6) infinite`;
            clearInterval(fighting);
            fighting = setInterval(fightFunction, player.atkSpeed);
        }
        // CRITIQUES
    } else if (e.target.classList.contains('critical')) {
        if (player.gold >= upgradesList.critical.cost) {
            player.gold -= upgradesList.critical.cost;
            player.critical += upgradesList.critical.effect;

            upgradesList.critical.cost = Math.round(upgradesList.critical.cost * 1.50);

            currentCrit.textContent = player.critical;
            currentCritCost.textContent = upgradesList.critical.cost;
        }
        // DEGATS CRITIQUES
    } else if (e.target.classList.contains('critical-dmg')) {
        if (player.gold >= upgradesList.criticalDmg.cost) {
            player.gold -= upgradesList.criticalDmg.cost;
            player.criticalDmg += upgradesList.criticalDmg.effect;
            // player.criticalDmg = player.criticalDmg.toFixed(2);

            upgradesList.criticalDmg.cost = Math.round(upgradesList.criticalDmg.cost * 2.5);

            currentCritDmg.textContent = player.criticalDmg;
            currentCritDmgCost.textContent = upgradesList.criticalDmg.cost;
        }
    }
    // else if autre chose
}

// J'assigne ma fonction d'upgrade
// à TOUTES mes cases upgrade
for (let i = 0; i < upgrades.length; i++) {
    upgrades[i].addEventListener('click', upgrade);
};

// Fonction d'achat de familiers
const buyPet = (e) => {
    for (let i = 0; i < pets.length; i++) {
        if (e.target.classList.contains(pets[i].name)) {
            if (player.gold >= pets[i].cost) {
                player.gold -= pets[i].cost;
                pets[i].cost = 0;
                getCurrentPet.className = '';
                isPetEquipped = true;
                equippedPet = pets[i].name;
                getCurrentPet.className = pets[i].name;
                petCost[i].textContent = pets[i].cost;
            };
        };
    };
};


const upgradePet = (param) => {
    for (let i = 0; i < pets.length; i++) {
        if (pets[i].name == param) {
            pets[i].killCount++;
            // TODO mettre un getCurrentPetEffect
            getCurrentPetKillLeft.textContent = `${pets[i].upgrade - pets[i].killCount} monstres restants
            pour recevoir un bonus de stats`;
            if (pets[i].killCount == pets[i].upgrade) {
                if (param == 'testPet') {
                    pets[0].attack++;
                    pets[i].killCount = 0;
                    pets[i].upgrade = Math.floor(pets[i].upgrade * 1.10);
                    player.attack++;
                    currentSTR.textContent = player.attack;
                    getCurrentPetEffect.textContent = `${pets[i].attack} Attaque bonus`;
                }
            }
        }

    }
}

// J'ajoute l'event pour acheter un familier
for (let i = 0; i < getAllPets.length; i++) {
    getAllPets[i].addEventListener('click', buyPet);
};

// Ouvre la modale pour les familiers et la referme
getPetModal.addEventListener('click', function () {
    modale.classList.remove('hidden');
    window.onclick = function (e) {
        if (e.target == modale) {
            modale.classList.add('hidden');
        };
    };
});

// Ouvre la modale pour les settings
getSettingsButton.addEventListener('click', function () {
    getSettingsModale.classList.remove('hidden');
    window.onclick = function (e) {
        if (e.target == getSettingsModale) {
            getSettingsModale.classList.add('hidden');
        };
    };
});

// Modale rebirth
getRebirthModaleButton.addEventListener('click', function () {
    getRebirthModale.classList.remove('hidden');
    window.onclick = function (e) {
        if (e.target == getRebirthModale) {
            getRebirthModale.classList.add('hidden');
        };
    };
});

// Rebirth fonction
// TODO
const rebirth = () => {
    // Remets les stats des ennemis, du joueur et des upgrades à 0
    for (const enemy in enemies) {
        enemies[enemy].maxHp = enemies[enemy].originalHp
        enemies[enemy].hp = enemies[enemy].originalHp;
        enemies[enemy].reward = enemies[enemy].originalReward;
    };

    for (const upgrade in upgradesList) {
        upgradesList[upgrade].cost = upgradesList[upgrade].originalCost;
        upgradesList[upgrade].effect = upgradesList[upgrade].originalEffect;
    };

    player.attack = 3;
    player.gold = 0;
    player.stage = 1;
    player.atkSpeed = 500,
        player.critical = 0;
    player.criticalDmg = 1.5;
    fillSkills();

    getEnemy.className = 'cub';
    clearInterval(fighting);
    fighting = setInterval(fightFunction, player.atkSpeed);
};

// Fonction pour lancer un combat contre un boss pour le rebirth
const launchBossFight = () => {
    if (player.stage >= 100) {
        upgradeScreen.classList.add('hidden');
        getRebirthModale.classList.add('hidden');
        launchTimer();
        clearInterval(fighting);
        fighting = setInterval(function () {
            fightBoss('cultist');
        }, player.atkSpeed);
    } else {
        document.querySelector('.warnStage100').style.color = 'red';
    }
};

// Fonction de timer pour les boss
const launchTimer = () => {
    let timer = 60;
    getTimer.classList.remove('hidden');
    getTimer.textContent = `${timer}s`
    timerLeft = setInterval(() => {
        timer--;
        getTimer.textContent = `${timer}s`
        if (timer === 0) {
            clearInterval(fighting);
            clearInterval(timerLeft);
            getStageDiv.classList.remove('hidden');
            getTimer.classList.add('hidden');
            upgradeScreen.classList.remove('hidden');
            // Je relance ma fonction de combat
            getEnemy.className = 'cub';
            fighting = setInterval(fightFunction, player.atkSpeed);
        }
    }, 1000);
}

// Boutons de sauvegarde et de load
document.querySelector('.manualSave').addEventListener('click', save);
document.querySelector('.manualLoad').addEventListener('click', load);
// Event pour que les tooltips dans le menu Familiers suivent le curseur
document.addEventListener('mousemove', moveTooltip, false);
getRebirthButton.addEventListener('click', launchBossFight);
getAutoStageButton.addEventListener('click', nextStageAuto);

// Sauvegarde auto, toutes les min
setInterval(() => {
    save();
    getSaveNotif.classList.remove('hidden');
    setTimeout(() => {
        getSaveNotif.classList.add('hidden');
    }, 2000);
}, 1000 * 60);

// TODO LIST
// upgrade vitesse attaque // Good
// critique // Good
// dégâts critiques // Good
// sauvegardes // Good
// attaque spéciale
// double attaque
// FAMILIERS // Good mais à continuer
// fishing
// rebirth // TODO CONTINUER (monnaie du rebirth (player.gems, gemCount))