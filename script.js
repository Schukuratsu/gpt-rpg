document.addEventListener('DOMContentLoaded', function () {
    const player = document.getElementById('player');
    const items = document.querySelectorAll('.item');
    const enemies = document.querySelectorAll('.enemy');
    const scoreElement = document.createElement('div');

    let score = 0;
    let gameRunning = true;

    // Adiciona o elemento de pontuação ao corpo da página
    scoreElement.id = 'score';
    document.body.appendChild(scoreElement);

    items.forEach(item => {
        item.addEventListener('click', () => {
            if (gameRunning) {
                item.style.display = 'none';
                score++;
                updateScore();
            }
        });
    });

    function updateScore() {
        document.title = `Coletor de Itens - Pontuação: ${score}`;
        // Atualiza a pontuação no elemento de pontuação
        scoreElement.textContent = `Pontuação: ${score}`;
    }

    function endGame() {
        gameRunning = false;
        // Exibe um alerta com a pontuação final
        alert(`Fim de Jogo! Pontuação Final: ${score}`);
    }

    function showMenu() {
        if (gameRunning) {
            alert(`Pontuação Atual: ${score}`);
        } else {
            alert(`Fim de Jogo! Pontuação Final: ${score}`);
        }
    }

    function checkCollision() {
        const playerRect = player.getBoundingClientRect();

        enemies.forEach(enemy => {
            const enemyRect = enemy.getBoundingClientRect();

            if (
                playerRect.top < enemyRect.bottom &&
                playerRect.bottom > enemyRect.top &&
                playerRect.left < enemyRect.right &&
                playerRect.right > enemyRect.left
            ) {
                // Colisão com inimigo, termina o jogo
                endGame();
            }
        });
    }

    function checkItemCollision() {
        const playerRect = player.getBoundingClientRect();

        items.forEach(item => {
            const itemRect = item.getBoundingClientRect();

            if (
                playerRect.top < itemRect.bottom &&
                playerRect.bottom > itemRect.top &&
                playerRect.left < itemRect.right &&
                playerRect.right > itemRect.left
            ) {
                // Colisão com item, incrementa a pontuação e esconde o item
                item.style.display = 'none';
                score++;
                updateScore();
            }
        });
    }

    function eliminateEnemy(enemy) {
        // Inicia uma animação para esconder o inimigo
        let opacity = 1;

        function animate() {
            opacity -= 0.02; // Ajuste conforme necessário
            enemy.style.opacity = opacity;

            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                // Remove o inimigo do DOM após a animação
                enemy.style.display = 'none';
            }
        }

        animate();
    }

    function eliminateEnemiesInDirection(mouseX, mouseY) {
        const playerRect = player.getBoundingClientRect();

        enemies.forEach(enemy => {
            const enemyRect = enemy.getBoundingClientRect();

            // Verifica se o inimigo está próximo e na direção do mouse
            const distance = Math.sqrt(
                Math.pow(playerRect.left - enemyRect.left, 2) +
                Math.pow(playerRect.top - enemyRect.top, 2)
            );

            const angle = Math.atan2(enemyRect.top - playerRect.top, enemyRect.left - playerRect.left);
            const directionX = Math.cos(angle);
            const directionY = Math.sin(angle);

            const dotProduct = (mouseX - playerRect.left) * directionX + (mouseY - playerRect.top) * directionY;

            if (distance < 100 && dotProduct > 0) {
                // Elimina o inimigo com animação
                eliminateEnemy(enemy);
                score += 5;
                updateScore();
            }
        });
    }

    document.addEventListener('mousedown', function (event) {
        if (!gameRunning) return;

        // Obtém as coordenadas do mouse no momento do clique
        const mouseX = event.clientX;
        const mouseY = event.clientY;

        // Elimina inimigos na direção do clique do mouse
        eliminateEnemiesInDirection(mouseX, mouseY);
    });

    document.addEventListener('keydown', function (event) {
        if (!gameRunning) return;

        const speed = 10;

        switch (event.key) {
            case 'ArrowUp':
                player.style.top = Math.max(0, player.offsetTop - speed) + 'px';
                break;
            case 'ArrowDown':
                player.style.top = Math.min(window.innerHeight - player.offsetHeight, player.offsetTop + speed) + 'px';
                break;
            case 'ArrowLeft':
                player.style.left = Math.max(0, player.offsetLeft - speed) + 'px';
                break;
            case 'ArrowRight':
                player.style.left = Math.min(window.innerWidth - player.offsetWidth, player.offsetLeft + speed) + 'px';
                break;
            case 'Escape':
                showMenu();
                break;
        }

        // Verifica colisão com itens e inimigos após cada movimento do jogador
        checkItemCollision();
        checkCollision();
    });
});
