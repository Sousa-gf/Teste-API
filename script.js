document.body.classList.add('locked');

const intro=document.querySelector('#intro');
const enter=document.querySelector('#enter');
enter.addEventListener('click',()=>{
  intro.classList.add('hide');
  document.body.classList.remove('locked');
  setTimeout(()=>document.querySelector('#historia').scrollIntoView({behavior:'smooth'}),350);
});

const cards=[...document.querySelectorAll('.memory-card')];
const carousel=document.querySelector('#carousel');
const dots=document.querySelector('#dots');
const progress=document.querySelector('#progress');

cards.forEach(card=>{
  card.addEventListener('click',()=>card.classList.toggle('flipped'));
  card.addEventListener('keydown',e=>{
    if(e.key==='Enter'||e.key===' '){e.preventDefault();card.classList.toggle('flipped')}
  });
});
cards.forEach((_,i)=>{
  const d=document.createElement('span');
  d.className='dot'+(i===0?' active':'');
  d.addEventListener('click',()=>cards[i].scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'}));
  dots.appendChild(d);
});
function updateCarousel(){
  const center=carousel.scrollLeft+carousel.clientWidth/2;
  let best=0,dist=Infinity;
  cards.forEach((c,i)=>{
    const d=Math.abs(c.offsetLeft+c.offsetWidth/2-center);
    if(d<dist){dist=d;best=i}
  });
  [...dots.children].forEach((d,i)=>d.classList.toggle('active',i===best));
  progress.style.width=((best+1)/cards.length*100)+'%';
}
carousel.addEventListener('scroll',()=>requestAnimationFrame(updateCarousel));
updateCarousel();

document.querySelectorAll('.timeline-trigger').forEach(trigger=>{
  trigger.addEventListener('click',()=>{
    const item=trigger.parentElement;
    document.querySelectorAll('.timeline-item.open').forEach(other=>{
      if(other!==item) other.classList.remove('open');
    });
    item.classList.toggle('open');
  });
});

const observer=new IntersectionObserver(entries=>{
 entries.forEach(entry=>{if(entry.isIntersecting)entry.target.classList.add('visible')});
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

let touchStartX=0;
carousel.addEventListener('touchstart',e=>touchStartX=e.changedTouches[0].screenX,{passive:true});
carousel.addEventListener('touchend',e=>{
  const delta=touchStartX-e.changedTouches[0].screenX;
  if(Math.abs(delta)>55){
    const current=cards.findIndex(c=>c.getBoundingClientRect().left>carousel.getBoundingClientRect().left-10);
    const target=Math.max(0,Math.min(cards.length-1,current+(delta>0?1:-1)));
    cards[target].scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'});
  }
},{passive:true});
