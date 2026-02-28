document.addEventListener('DOMContentLoaded', function() {

  gsap.registerPlugin(ScrollTrigger);

  var isMobile = window.matchMedia('(max-width: 1060px)').matches;

  /* ── LOADER ─────────────────────────── */
  document.body.classList.add('loading');
  var loader=document.getElementById('loader'), bar=document.getElementById('loaderBar'),
      numEl=document.getElementById('loaderNum'), countEl=document.getElementById('loaderCount');
  var loaderDone=false;
  if(isMobile){ var tl=document.getElementById('loaderTagline'); if(tl) tl.style.display='none'; }

  (function run(){
    var phases=[{t:22,d:460},{t:48,d:520},{t:71,d:580},{t:88,d:520},{t:100,d:360}];
    var pi=0,cur=0;
    function next(){
      if(pi>=phases.length){finishLoader();return;}
      var ph=phases[pi],sv=cur,st=null;
      function tick(ts){
        if(!st)st=ts; var p=Math.min((ts-st)/ph.d,1),e=p<0.5?2*p*p:1-Math.pow(-2*p+2,2)/2;
        cur=Math.floor(sv+(ph.t-sv)*e); bar.style.width=cur+'%'; numEl.textContent=cur; countEl.textContent=cur+' / 100';
        if(p<1)requestAnimationFrame(tick); else{pi++;setTimeout(next,55);}
      }
      requestAnimationFrame(tick);
    }
    next();
  })();

  function finishLoader(){
    if(loaderDone)return; loaderDone=true;
    bar.style.width='100%'; numEl.textContent='100'; countEl.textContent='100 / 100';
    setTimeout(function(){
      loader.classList.add('hide');
      document.body.classList.remove('loading');
      setTimeout(function(){
        document.body.classList.add('page-ready');
        loader.style.display='none';
        playHeroEntrance();
      },200);
    },380);
  }
  setTimeout(finishLoader,4200);

  /* ── ROTATING WORD ─────────────────── */
  var rotWords=['Friction.','Headaches.','Overruns.','Paperwork.','Unpredictability.','Questions.'];
  var rotIdx=0, rotRunning=false;
  var rotEl=document.getElementById('rotatingWord');
  function getH(){ return rotEl.offsetHeight||80; }

  function startWordRotationInterval(){
    if(rotRunning) return; rotRunning=true;
    setInterval(function(){
      var h=getH();
      var next=rotWords[(++rotIdx)%rotWords.length];
      gsap.to(rotEl,{y:-h, opacity:0, duration:0.5, ease:'power2.in', onComplete:function(){
        rotEl.textContent=next;
        gsap.fromTo(rotEl,{y:h,opacity:0},{y:0,opacity:1,duration:0.7,ease:'power3.out'});
      }});
    },2800);
  }

  /* ── HERO ENTRANCE TIMELINE ────────── */
  function playHeroEntrance(){
    var tl=gsap.timeline({defaults:{ease:'power3.out'}});

    tl.to('.hero-top-bar',{opacity:1,y:0,duration:0.9},0.05);

    if(!isMobile){
      tl.add(function(){
        var ey=document.getElementById('heroEyebrow');
        if(ey) scramble(ey,ey.textContent.trim(),1100);
      },0.3);
    }

    tl.to('.hero-body-wrap',{opacity:1,y:0,duration:1.0},0.15);
    tl.to('.hero-headline .line:nth-child(1) span',{y:0,duration:1.1},0.25);
    tl.to('.hero-headline .line:nth-child(2) span',{y:0,duration:1.1},0.38);

    tl.fromTo(rotEl,
      {y:getH(),opacity:0},
      {y:0,opacity:1,duration:0.8},
      0.50
    );

    tl.to('.hero-panel',{opacity:1,duration:0.8},0.45);
    tl.to('.hero-foot',{opacity:1,y:0,duration:0.7},0.55);

    /* Stat number roll — Phase 4 */
    tl.add(function(){
      document.querySelectorAll('.hero-proof-sub-pct').forEach(function(el){
        var textNode=el.firstChild;
        if(!textNode||textNode.nodeType!==3) return;
        var raw=textNode.textContent.replace('~','').trim();
        var target=parseInt(raw,10);
        if(isNaN(target)) return;
        var startVal=Math.max(0,target-4);
        var obj={val:startVal};
        textNode.textContent='~'+startVal;
        gsap.to(obj,{
          val:target,
          duration:0.7,
          ease:'power2.out',
          snap:{val:1},
          onUpdate:function(){ textNode.textContent='~'+Math.round(obj.val); }
        });
      });
    },0.6);

    tl.add(function(){ startWordRotationInterval(); });
  }

  /* ── CANADA TABS ────────────────────── */
  window.switchTab=function(tab){
    document.querySelectorAll('.canada-tab-btn').forEach(function(btn){
      btn.classList.toggle('active', btn.dataset.tab===tab);
    });
    document.querySelectorAll('.canada-panel').forEach(function(panel){
      panel.classList.toggle('active', panel.id==='tab-'+tab);
    });
  };

  /* ── YEAR ───────────────────────────── */
  document.getElementById('yr').textContent=new Date().getFullYear();

  /* ── HAMBURGER ──────────────────────── */
  var burger=document.getElementById('burger'), overlay=document.getElementById('navOverlay'),
      navEl=document.getElementById('nav'), menuOpen=false;
  burger.addEventListener('click',function(){
    menuOpen=!menuOpen;
    navEl.classList.toggle('menu-open',menuOpen);
    overlay.classList.toggle('open',menuOpen);
    document.body.style.overflow=menuOpen?'hidden':'';
  });
  window.closeMenu=function(){
    menuOpen=false; navEl.classList.remove('menu-open'); overlay.classList.remove('open'); document.body.style.overflow='';
  };

  /* ── CURSOR ─────────────────────────── */
  if(!isMobile){
    var curEl=document.getElementById('cur'), dotEl=document.getElementById('curDot');
    var rx=window.innerWidth/2,ry=window.innerHeight/2,mx=rx,my=ry;
    document.addEventListener('mousemove',function(e){mx=e.clientX;my=e.clientY;dotEl.style.left=mx+'px';dotEl.style.top=my+'px';dotEl.classList.add('show');});
    function lerp(a,b,t){return a+(b-a)*t;}
    (function loop(){rx=lerp(rx,mx,0.1);ry=lerp(ry,my,0.1);curEl.style.left=rx+'px';curEl.style.top=ry+'px';requestAnimationFrame(loop);})();
    document.querySelectorAll('a,button,.svc-card,.proc-item,.diff-card,.canada-card,.cta-action').forEach(function(el){
      el.addEventListener('mouseenter',function(){curEl.classList.add('on');});
      el.addEventListener('mouseleave',function(){curEl.classList.remove('on');});
    });
  }

  /* ── NAV SCROLL ─────────────────────── */
  window.addEventListener('scroll',function(){ navEl.classList.toggle('scrolled',window.scrollY>40&&!menuOpen); });

  /* ── SCROLL HINT ────────────────────── */
  var scrollHint=document.getElementById('heroScroll'), scrollHidden=false;
  window.addEventListener('scroll',function(){
    if(!scrollHidden&&window.scrollY>60){scrollHidden=true;scrollHint.classList.add('hidden');}
    else if(scrollHidden&&window.scrollY<=60){scrollHidden=false;scrollHint.classList.remove('hidden');}
  },{passive:true});

  /* ── (marquee now handled by GSAP below) ── */

  /* ── SCROLL REVEAL (ScrollTrigger) ──── */
  ScrollTrigger.batch('.reveal', {
    onEnter: function(batch) {
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration: 0.95,
        ease: 'power3.out',
        stagger: 0.12,
        overwrite: true
      });
    },
    start: 'top 92%',
    once: true
  });

  /* ── FOOTER REVEAL (ScrollTrigger) ──── */
  var footerEl=document.getElementById('siteFooter');
  ScrollTrigger.create({
    trigger: footerEl,
    start: 'top 98%',
    once: true,
    onEnter: function() {
      gsap.to(footerEl, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' });
      gsap.to('.f-tagline', { opacity: 1, y: 0, duration: 0.8, delay: 0.4, ease: 'power3.out' });
    }
  });

  /* ── SPECIALIST ANIMATION ───────────── */
  var specWord=document.getElementById('specialistWord');
  'Specialist'.split('').forEach(function(ch,i){
    var s=document.createElement('span'); s.className='sl'; s.textContent=ch;
    s.style.transitionDelay=(0.038*i)+'s'; specWord.appendChild(s);
  });
  new IntersectionObserver(function(entries){
    if(entries[0].isIntersecting){setTimeout(function(){specWord.classList.add('animated');},200);}
  },{threshold:0.4}).observe(document.querySelector('.who-left'));

  /* ── HEADLINE WORD-BY-WORD REVEALS ──── */
  function splitWords(selector){
    document.querySelectorAll(selector).forEach(function(el){
      var nodes=Array.prototype.slice.call(el.childNodes);
      var frag=document.createDocumentFragment();
      nodes.forEach(function(node){
        if(node.nodeType===3){
          node.textContent.split(/(\s+)/).forEach(function(w){
            if(/^\s+$/.test(w)){frag.appendChild(document.createTextNode(w));}
            else if(w){
              var outer=document.createElement('span');outer.className='word';outer.style.display='inline-block';outer.style.overflow='hidden';outer.style.paddingTop='0.1em';outer.style.paddingBottom='0.15em';outer.style.marginTop='-0.1em';outer.style.marginBottom='-0.15em';outer.style.paddingLeft='0.08em';outer.style.marginLeft='-0.08em';
              var inner=document.createElement('span');inner.className='word-inner';inner.style.display='inline-block';inner.style.transform='translateY(110%)';inner.textContent=w;
              outer.appendChild(inner);frag.appendChild(outer);
            }
          });
        } else if(node.nodeName==='BR'){
          frag.appendChild(node.cloneNode());
        } else {
          var clone=node.cloneNode(false);
          (node.textContent||'').split(/(\s+)/).forEach(function(w){
            if(/^\s+$/.test(w)){clone.appendChild(document.createTextNode(w));}
            else if(w){
              var outer=document.createElement('span');outer.className='word';outer.style.display='inline-block';outer.style.overflow='hidden';outer.style.paddingTop='0.1em';outer.style.paddingBottom='0.15em';outer.style.marginTop='-0.1em';outer.style.marginBottom='-0.15em';outer.style.paddingLeft='0.08em';outer.style.marginLeft='-0.08em';
              var inner=document.createElement('span');inner.className='word-inner';inner.style.display='inline-block';inner.style.transform='translateY(110%)';inner.textContent=w;
              outer.appendChild(inner);clone.appendChild(outer);
            }
          });
          frag.appendChild(clone);
        }
      });
      el.innerHTML='';el.appendChild(frag);
    });
  }
  splitWords('.canada-headline, .bid-headline, .cta-headline');
  document.querySelectorAll('.canada-headline, .bid-headline, .cta-headline').forEach(function(h){
    var inners=h.querySelectorAll('.word-inner');
    ScrollTrigger.create({
      trigger:h, start:'top 85%', once:true,
      onEnter:function(){ gsap.to(inners,{y:0,duration:1.0,ease:'power3.out',stagger:0.045}); }
    });
  });

  /* ── PARALLAX ON DARK SECTIONS ──────── */
  if(!isMobile){
    document.querySelectorAll('.diff-section, .bid-section').forEach(function(sec){
      var inner=sec.querySelector('.s-wrap');
      if(!inner) return;
      gsap.fromTo(inner,{y:40},{
        y:-40, ease:'none',
        scrollTrigger:{trigger:sec,start:'top bottom',end:'bottom top',scrub:0.6}
      });
    });
  }

  /* ── GSAP MARQUEE ──────────────────── */
  (function(){
    var mt=document.getElementById('marqueeTrack');
    var mw=document.querySelector('.marquee-wrap');
    if(!mt||!mw) return;
    var halfW=mt.scrollWidth/2;
    var mAnim=gsap.fromTo(mt,{x:0},{x:-halfW,duration:44,ease:'none',repeat:-1});
    mw.addEventListener('mouseenter',function(){gsap.to(mAnim,{timeScale:0.05,duration:0.6,ease:'power2.out'});});
    mw.addEventListener('mouseleave',function(){gsap.to(mAnim,{timeScale:1,duration:0.6,ease:'power2.in'});});
  })();

  /* ── SCRAMBLE ───────────────────────── */
  function scramble(el,text,dur){
    var chars='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@.-',st=null;
    (function step(ts){
      if(!st)st=ts; var p=Math.min((ts-st)/dur,1),res=Math.floor(p*text.length),out='';
      for(var i=0;i<text.length;i++) out+=i<res?text[i]:chars[Math.floor(Math.random()*chars.length)];
      el.textContent=out; if(p<1)requestAnimationFrame(step); else el.textContent=text;
    })(performance.now());
  }

  /* ── COPY EMAIL ─────────────────────── */
  var _email=['hello','analogproductionservices.com'].join('@');
  window.copyEmail=function(){
    var toast=document.getElementById('toast');
    function show(){
      toast.classList.add('show'); setTimeout(function(){toast.classList.remove('show');},2600);
    }
    if(navigator.clipboard&&navigator.clipboard.writeText) navigator.clipboard.writeText(_email).then(show).catch(function(){fb(_email);show();});
    else{fb(_email);show();}
  };
  function fb(t){var ta=document.createElement('textarea');ta.value=t;ta.style.cssText='position:fixed;opacity:0;';document.body.appendChild(ta);ta.select();try{document.execCommand('copy');}catch(e){}document.body.removeChild(ta);}

});
