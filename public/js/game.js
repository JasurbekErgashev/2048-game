class QuantumDrift {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.player = null;
        this.socket = null;
        this.quantumEnergy = 100;
        this.speed = 0;
        this.lap = 1;
        this.init();
    }

    init() {
        // Initialize Three.js scene
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('game-canvas'), antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        // Initialize socket connection
        this.socket = io();

        // Set up event listeners
        this.setupEventListeners();
        
        // Create game elements
        this.createPlayer();
        this.createTrack();
        this.createQuantumEffects();

        // Start game loop
        this.animate();
    }

    createPlayer() {
        const geometry = new THREE.BoxGeometry(1, 0.5, 2);
        const material = new THREE.MeshPhongMaterial({ 
            color: 0x00f3ff,
            emissive: 0x00718f,
            shininess: 100 
        });
        this.player = new THREE.Mesh(geometry, material);
        this.scene.add(this.player);
        
        // Add vehicle lights
        this.addVehicleLights();
    }

    createTrack() {
        // Create a procedurally generated track with quantum zones
        const trackGeometry = new THREE.TorusGeometry(20, 3, 16, 100);
        const trackMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x444444,
            emissive: 0x222222
        });
        const track = new THREE.Mesh(trackGeometry, trackMaterial);
        track.rotation.x = Math.PI / 2;
        this.scene.add(track);

        // Add track lighting
        this.addTrackLighting();
    }

    createQuantumEffects() {
        // Create particle system for quantum effects
        const particleGeometry = new THREE.BufferGeometry();
        const particleCount = 1000;
        const positions = new Float32Array(particleCount * 3);
        
        for(let i = 0; i < particleCount * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 100;
        }
        
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            color: 0xbc13fe,
            size: 0.1,
            transparent: true,
            blending: THREE.AdditiveBlending
        });
        
        this.quantumParticles = new THREE.Points(particleGeometry, particleMaterial);
        this.scene.add(this.quantumParticles);
    }

    addVehicleLights() {
        const light1 = new THREE.PointLight(0x00f3ff, 1, 2);
        light1.position.set(0.5, 0.2, -1);
        this.player.add(light1);

        const light2 = new THREE.PointLight(0x00f3ff, 1, 2);
        light2.position.set(-0.5, 0.2, -1);
        this.player.add(light2);
    }

    addTrackLighting() {
        const ambientLight = new THREE.AmbientLight(0x404040);
        this.scene.add(ambientLight);

        const spotLight = new THREE.SpotLight(0xffffff, 1);
        spotLight.position.set(0, 50, 0);
        spotLight.angle = Math.PI / 4;
        this.scene.add(spotLight);
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        document.addEventListener('keydown', (e) => this.handleInput(e));
        
        // Menu buttons
        document.getElementById('start-btn').addEventListener('click', () => this.startGame());
        document.getElementById('tutorial-btn').addEventListener('click', () => this.showTutorial());
    }

    handleInput(e) {
        const moveSpeed = 0.2;
        const rotateSpeed = 0.05;

        switch(e.key) {
            case 'ArrowUp':
                this.speed = Math.min(this.speed + moveSpeed, 2);
                break;
            case 'ArrowDown':
                this.speed = Math.max(this.speed - moveSpeed, -1);
                break;
            case 'ArrowLeft':
                this.player.rotation.y += rotateSpeed;
                break;
            case 'ArrowRight':
                this.player.rotation.y -= rotateSpeed;
                break;
            case ' ':
                this.activateQuantumPhase();
                break;
        }

        // Update HUD
        this.updateHUD();
    }

    activateQuantumPhase() {
        if (this.quantumEnergy >= 20) {
            this.quantumEnergy -= 20;
            gsap.to(this.player.material, {
                opacity: 0.3,
                duration: 1,
                yoyo: true,
                repeat: 1,
                onComplete: () => {
                    this.player.material.opacity = 1;
                }
            });
        }
    }

    updateHUD() {
        document.getElementById('speed-value').textContent = Math.round(this.speed * 100);
        document.getElementById('energy-value').textContent = this.quantumEnergy;
        document.getElementById('lap-value').textContent = `${this.lap}/3`;
    }

    startGame() {
        document.getElementById('menu').classList.add('hidden');
        document.getElementById('game').classList.remove('hidden');
    }

    showTutorial() {
        // Implement tutorial overlay
        console.log('Tutorial shown');
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Update player position
        if (this.speed !== 0) {
            this.player.position.x += Math.sin(this.player.rotation.y) * this.speed;
            this.player.position.z += Math.cos(this.player.rotation.y) * this.speed;
        }

        // Update quantum particles
        this.quantumParticles.rotation.y += 0.001;

        // Regenerate quantum energy
        if (this.quantumEnergy < 100) {
            this.quantumEnergy += 0.1;
        }

        // Update camera position to follow player
        this.camera.position.x = this.player.position.x;
        this.camera.position.y = 10;
        this.camera.position.z = this.player.position.z + 15;
        this.camera.lookAt(this.player.position);

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize game when window loads
window.addEventListener('load', () => {
    new QuantumDrift();
});
