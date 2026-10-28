const $=id=>document.getElementById(id);
const image=key=>{const source=window.IMAGES[key];if(!source)throw Error(`Missing image: ${key}`);return source;};
const icon=name=>`<svg aria-hidden="true"><use href="#${name}"/></svg>`;
const projects=['paper','craft','brand','modeling','travel','website','poster','health'].map(id=>window.CONTENT.projects.find(project=>project.id===id));
document.querySelectorAll('img[data-image]').forEach(item=>item.src=image(item.dataset.image));
let screen='cover',history=[],selected=0,caseIndex=0,pictures=[],pictureIndex=0,pictureTrigger=null,scrollFrame;
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
const number=index=>String(index+1).padStart(2,'0');

function show(name,remember=true){
 if(remember&&screen!==name)history.push(screen);
 document.querySelectorAll('.screen').forEach(page=>page.hidden=page.id!==name);screen=name;
 if(name==='gallery'){$('exhibits').scrollTo({left:selected*$('exhibits').clientWidth,behavior:'auto'});updateSelection();}
 const control=$(name).querySelector('button');if(control)control.focus({preventScroll:true});
}
function back(){if(!$('lightbox').hidden){closeImage();return true;}if(history.length){show(history.pop(),false);return true;}return false;}
function updateSelection(){
 $('project-position').textContent=`${number(selected)} / ${String(projects.length).padStart(2,'0')}`;
 $('project-prev').disabled=selected===0;$('project-next').disabled=selected===projects.length-1;
 document.querySelectorAll('.index-row').forEach((row,index)=>row.setAttribute('aria-current',String(index===selected)));
 document.querySelectorAll('.exhibit').forEach((slide,index)=>slide.inert=index!==selected);
}
function select(index,animate=false){
 selected=Math.max(0,Math.min(projects.length-1,index));
 $('exhibits').scrollTo({left:selected*$('exhibits').clientWidth,behavior:animate&&!reduceMotion.matches?'smooth':'auto'});updateSelection();
}
function openIndex(){updateSelection();show('index');}
$('enter').onclick=()=>{history=['cover'];show('gallery',false);};
document.querySelectorAll('[data-index]').forEach(button=>button.onclick=openIndex);
document.querySelectorAll('[data-back]').forEach(button=>button.onclick=back);
function home(){history=[];show('cover',false);$('cover').scrollTop=0;}
$('gallery-home').onclick=home;$('index-home').onclick=home;
$('project-prev').onclick=()=>select(selected-1,true);$('project-next').onclick=()=>select(selected+1,true);
$('exhibits').addEventListener('scroll',()=>{cancelAnimationFrame(scrollFrame);scrollFrame=requestAnimationFrame(()=>{if(screen==='gallery'){selected=Math.max(0,Math.min(projects.length-1,Math.round($('exhibits').scrollLeft/$('exhibits').clientWidth)));updateSelection();}});});
window.addEventListener('resize',()=>{if(screen==='gallery')select(selected);});

projects.forEach((project,index)=>{
 const exhibit=document.createElement('article');exhibit.className='exhibit';exhibit.dataset.project=project.id;exhibit.setAttribute('aria-label',`${number(index)} ${project.title}`);
 const art=document.createElement('button');art.className='exhibit-art';art.setAttribute('aria-label',`查看${project.title}作品`);
 const ordinal=document.createElement('span');ordinal.className='exhibit-number';ordinal.textContent=number(index);ordinal.setAttribute('aria-hidden','true');
 const picture=document.createElement('img');picture.src=image(project.id==='brand'?project.groups['应用场景'][0]:project.cover);picture.alt=project.title;art.append(ordinal,picture);art.onclick=()=>openCase(index);
 const caption=document.createElement('div');caption.className='exhibit-caption';const meta=document.createElement('div');meta.className='exhibit-meta';
 const label=document.createElement('span');label.textContent=project.category;const count=document.createElement('span');count.textContent=`${Object.values(project.groups).flat().length} 张图片`;meta.append(label,count);
 const heading=document.createElement('h1');heading.textContent=project.title;
 const enter=document.createElement('button');enter.setAttribute('aria-label',`打开${project.title}详情`);enter.textContent='查看作品';enter.insertAdjacentHTML('beforeend',icon('arrow'));enter.onclick=()=>openCase(index);
 caption.append(meta,heading,enter);exhibit.append(art,caption);$('exhibits').append(exhibit);
 const row=document.createElement('button');row.className='index-row';row.setAttribute('aria-label',`前往${project.title}`);
 const order=document.createElement('small');order.textContent=number(index);const thumb=document.createElement('img');thumb.src=image(project.cover);thumb.alt='';
 const text=document.createElement('div');const title=document.createElement('h2');title.textContent=project.title;const category=document.createElement('p');category.textContent=project.category;text.append(title,category);row.append(order,thumb,text);row.insertAdjacentHTML('beforeend',icon('diagonal'));
 row.onclick=()=>{selected=index;history=['cover'];show('gallery',false);};$('index-list').append(row);
});
updateSelection();

function openCase(index,continuing=false){
 caseIndex=index;selected=index;const project=projects[index];
 $('case-category').textContent=`${number(index)} / ${project.category}`;$('case-title').textContent=project.title;$('case-subtitle').textContent=project.subtitle;$('case-description').textContent=project.description;
 $('case-sections').textContent='';pictures=[];
 Object.entries(project.groups).forEach(([name,keys],group)=>{
  const section=document.createElement('section');section.className='case-section';
  if(['poster','health'].includes(project.id))section.classList.add('layout-portraits');
  if(['travel','website'].includes(project.id))section.classList.add('layout-contact-sheet');
  const header=document.createElement('header');header.className='case-section-header';const order=document.createElement('span');order.textContent=number(group);const title=document.createElement('h2');title.textContent=name;header.append(order,title);
  const groupImages=document.createElement('div');groupImages.className='section-images';
  keys.forEach((key,offset)=>{
   const position=pictures.length;pictures.push({key,label:`${project.title} · ${name} · ${offset+1}`});
   const button=document.createElement('button');button.className='case-image';button.setAttribute('aria-label',`放大${name}图片${offset+1}`);
   const picture=document.createElement('img');picture.src=image(key);picture.alt=pictures[position].label;button.append(picture);button.insertAdjacentHTML('beforeend',`<span>${number(position)} / 查看大图 ${icon('zoom')}</span>`);button.onclick=()=>openImage(position,button);groupImages.append(button);
  });
  section.append(header,groupImages);$('case-sections').append(section);
 });
 const next=(index+1)%projects.length;$('case-next').querySelector('strong').textContent=projects[next].title;$('case-next').onclick=()=>openCase(next,true);
 show('case',!continuing);$('case').scrollTop=0;
}
$('case-back').onclick=()=>{history=['cover'];show('gallery',false);};
function updateImage(){
 const item=pictures[pictureIndex];$('large-image').src=image(item.key);$('large-image').alt=item.label;
 $('lightbox-title').textContent=projects[caseIndex].title;$('image-index').textContent=`${pictureIndex+1} / ${pictures.length}`;$('image-prev').disabled=pictureIndex===0;$('image-next').disabled=pictureIndex===pictures.length-1;document.querySelector('.lightbox-stage').classList.remove('zoomed');
}
function openImage(index,trigger){pictureIndex=index;pictureTrigger=trigger;updateImage();$('lightbox').hidden=false;$('case').inert=true;$('lightbox-close').focus();}
function closeImage(){$('lightbox').hidden=true;$('case').inert=false;if(pictureTrigger)pictureTrigger.focus({preventScroll:true});}
$('lightbox-close').onclick=closeImage;
$('image-prev').onclick=()=>{if(pictureIndex>0){pictureIndex--;updateImage();}};
$('image-next').onclick=()=>{if(pictureIndex<pictures.length-1){pictureIndex++;updateImage();}};
$('image-zoom').onclick=()=>document.querySelector('.lightbox-stage').classList.toggle('zoomed');
window.handleBack=back;
document.addEventListener('keydown',event=>{
 if(event.key==='Escape'){event.preventDefault();back();}
 if(event.key==='ArrowLeft'||event.key==='ArrowRight'){
  if(!$('lightbox').hidden){event.preventDefault();$(event.key==='ArrowLeft'?'image-prev':'image-next').click();}
  else if(screen==='gallery'){event.preventDefault();select(selected+(event.key==='ArrowLeft'?-1:1),true);}
 }
 if(event.key==='Tab'&&!$('lightbox').hidden){const buttons=[...$('lightbox').querySelectorAll('button:not([disabled])')],first=buttons[0],last=buttons[buttons.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}}
});
