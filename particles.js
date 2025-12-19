// Lightweight particle background. Exposes enableParticles() and disableParticles().
(function(){
    let canvas, ctx, w, h, raf, particles = [], running = false;
    const NUM = 150;

    function createCanvas(){
        canvas = document.createElement('canvas');
        canvas.id = 'bg-particles-canvas';
        canvas.style.position = 'fixed';
        canvas.style.left = '0';
        canvas.style.top = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.zIndex = '0';
        canvas.style.pointerEvents = 'none';
        document.body.insertBefore(canvas, document.body.firstChild);
        ctx = canvas.getContext('2d');
        resize();
        window.addEventListener('resize', resize);
    }

    function resize(){
        if(!canvas) return;
        const dpr = window.devicePixelRatio || 1;
        w = canvas.width = Math.max(300, Math.floor(window.innerWidth * dpr));
        h = canvas.height = Math.max(300, Math.floor(window.innerHeight * dpr));
        canvas.style.width = window.innerWidth + 'px';
        canvas.style.height = window.innerHeight + 'px';
        ctx.setTransform(dpr,0,0,dpr,0,0);
    }

    function rand(min, max){ return Math.random() * (max - min) + min; }

    function initParticles(){
        particles = [];
        for(let i=0;i<NUM;i++){
            particles.push({
                x: Math.random()*window.innerWidth,
                y: Math.random()*window.innerHeight,
                r: rand(0.6, 2.2),
                vx: rand(-0.3, 0.3),
                vy: rand(-0.15, 0.15),
                life: rand(80, 260),
                age: Math.random()*260
            });
        }
    }

    function step(){
        if(!running) return;
        ctx.clearRect(0,0,canvas.width, canvas.height);
        for(let p of particles){
            p.x += p.vx;
            p.y += p.vy;
            p.age += 1;
            if(p.x < -50) p.x = window.innerWidth + 50;
            if(p.x > window.innerWidth + 50) p.x = -50;
            if(p.y < -50) p.y = window.innerHeight + 50;
            if(p.y > window.innerHeight + 50) p.y = -50;
            const alpha = 0.12 * (1 - (p.age % p.life)/p.life);
            ctx.beginPath();
            ctx.fillStyle = 'rgba(120,140,255,'+alpha+')';
            ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
            ctx.fill();
        }
        raf = requestAnimationFrame(step);
    }

    function enable(){
        if(running) return;
        running = true;
        createCanvas();
        initParticles();
        raf = requestAnimationFrame(step);
    }

    function disable(){
        running = false;
        if(raf) cancelAnimationFrame(raf);
        raf = null;
        if(canvas){
            window.removeEventListener('resize', resize);
            canvas.remove();
            canvas = null;
        }
    }

    // expose
    window.enableParticles = enable;
    window.disableParticles = disable;

    // auto-start if saved preference exists
    try{
        const pref = localStorage.getItem('particlesEnabled');
        if(pref === 'true'){
            if(document.readyState === 'complete' || document.readyState === 'interactive') enable();
            else document.addEventListener('DOMContentLoaded', enable);
        }
    }catch(e){}

})();
