/* ELORA WEBSITE — Owner contact settings
   Set these three values before publishing your site. WhatsApp: international digits, e.g. 919876543210.
   They are empty in the preview because no business contact information was provided.
*/
const ELORA_CONFIG = { whatsapp: '', instagram: '', email: '' };

const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const rupee = value => `₹${Number(value).toLocaleString('en-IN')}`;
const escapeHtml = (v='') => String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let savedLinks = {};
try { savedLinks = JSON.parse(localStorage.getItem('elora_demo_links') || '{}'); } catch (error) { /* Private browsing / preview without storage. */ }
let settings={ ...ELORA_CONFIG, ...savedLinks };
let cart=[];
let preparedMessage='';
let toastTimer;

$('#year').textContent = new Date().getFullYear();
function toast(message){const node=$('#toast');node.textContent=message;node.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>node.classList.remove('show'),3000)}
function toggleMenu(force){const nav=$('#mobileNav'),btn=$('#menuToggle');const show=typeof force==='boolean'?force:nav.hidden;nav.hidden=!show;btn.setAttribute('aria-expanded',String(show))}
$('#menuToggle').addEventListener('click',()=>toggleMenu());
$$('#mobileNav a').forEach(a=>a.addEventListener('click',()=>toggleMenu(false)));
document.addEventListener('click',e=>{const nav=$('#mobileNav');if(nav&&!nav.hidden&&!e.target.closest('#mobileNav')&&!e.target.closest('#menuToggle'))toggleMenu(false);});
$$('.desktop-nav a').forEach(a=>a.addEventListener('click',()=>{$$('.desktop-nav a').forEach(b=>b.classList.remove('active'));a.classList.add('active')}));

function applyFilter(filter){$$('.filter-chip').forEach(b=>b.classList.toggle('selected',b.dataset.filter===filter));$$('.product-card').forEach(card=>{card.hidden=filter!=='all'&&card.dataset.category!==filter});}
$$('.filter-chip').forEach(b=>b.addEventListener('click',()=>applyFilter(b.dataset.filter)));
$$('[data-set-filter]').forEach(a=>a.addEventListener('click',()=>applyFilter(a.dataset.setFilter)));

function renderCart(){ $('#cartCount').textContent=cart.length;let list=$('#cartItems');if(!cart.length){list.innerHTML='<div class="cart-empty"><span>✧</span><h3>Your basket is waiting.</h3><p>Add a few thoughtful picks to create an enquiry.</p></div>';$('#cartEnquire').disabled=true;return;}$('#cartEnquire').disabled=false;list.innerHTML=cart.map((item,i)=>`<div class="cart-line"><img src="${escapeHtml(item.img)}" alt=""><div><strong>${escapeHtml(item.name)}</strong><small>From ${rupee(item.price)}</small></div><button data-remove="${i}" aria-label="Remove ${escapeHtml(item.name)}">Remove</button></div>`).join('');$$('[data-remove]',list).forEach(b=>b.addEventListener('click',()=>{cart.splice(Number(b.dataset.remove),1);renderCart();toast('Removed from your picks')}));}
function toggleCart(open){$('#cartDrawer').hidden=!open;$('#drawerOverlay').hidden=!open;document.body.style.overflow=open?'hidden':'';if(open)$('#closeCart').focus();}
$$('.product-card .add-btn').forEach(b=>b.addEventListener('click',()=>{const c=b.closest('.product-card');cart.push({name:c.dataset.name,price:Number(c.dataset.price),img:$('.product-image img',c).getAttribute('src')});renderCart();toast(`${c.dataset.name} added to your enquiry`)}));
$('#openCart').addEventListener('click',()=>toggleCart(true));$('#closeCart').addEventListener('click',()=>toggleCart(false));$('#drawerOverlay').addEventListener('click',()=>toggleCart(false));
$('#cartEnquire').addEventListener('click',()=>{if(!cart.length)return;const message=`Hello ELORA! I'd love to enquire about these gift hampers:\n\n${cart.map((p,i)=>`${i+1}. ${p.name} (from ${rupee(p.price)})`).join('\n')}\n\nIndicative starting total: ${rupee(cart.reduce((sum,p)=>sum+p.price,0))}\n\nPlease share availability, contents and final pricing. Thank you!`;toggleCart(false);showMessage('Your hamper enquiry',message)});
renderCart();

function builderState(){const choice=$('input[name=boxType]:checked');const checked=$$('#addOnChoices input:checked');const price=499+Number(choice.dataset.extra)+checked.reduce((t,c)=>t+Number(c.dataset.price),0);return{box:choice.value,addons:checked.map(c=>({name:c.value,price:Number(c.dataset.price)})),price,recipient:$('#giftRecipient').value.trim(),occasion:$('#giftOccasion').value,message:$('#giftMessage').value.trim()};}
function renderBuilder(){$$('.swatch-option').forEach(el=>el.classList.toggle('active',$('input',el).checked));const state=builderState();$('#builderTotal').textContent=rupee(state.price);$('#builderItemCount').textContent=state.addons.length?`${state.addons.length} chosen extras · includes box, ribbon & card`:'Includes gift box, ribbon & a greeting card';}

const BOX_FINISH_SLIDES = ['Ivory & Rose Gold', 'Emerald & Gold', 'Blush Pink'];
let currentFinishSlide = 0;

function updateBuilderCarousel(index, updateRadio = true) {
  if (index < 0) index = 0;
  if (index >= BOX_FINISH_SLIDES.length) index = BOX_FINISH_SLIDES.length - 1;
  currentFinishSlide = index;

  const track = $('#builderCarouselTrack');
  if (track) {
    track.style.transform = `translateX(-${index * 100}%)`;
  }

  const slides = $$('.builder-carousel-slide');
  slides.forEach((s, idx) => s.classList.toggle('active', idx === index));

  const dots = $$('.carousel-dot');
  dots.forEach((d, idx) => d.classList.toggle('active', idx === index));

  if (updateRadio) {
    const finishName = BOX_FINISH_SLIDES[index];
    const targetRadio = $(`input[name="boxType"][value="${finishName}"]`);
    if (targetRadio && !targetRadio.checked) {
      targetRadio.checked = true;
      renderBuilder();
    }
  }
}

function onBoxChoiceChange() {
  const checked = $('input[name="boxType"]:checked');
  if (checked) {
    const idx = BOX_FINISH_SLIDES.indexOf(checked.value);
    if (idx !== -1 && idx !== currentFinishSlide) {
      updateBuilderCarousel(idx, false);
    }
  }
}

$$('#boxChoices input').forEach(el => el.addEventListener('change', () => {
  renderBuilder();
  onBoxChoiceChange();
}));
$$('#addOnChoices input').forEach(el => el.addEventListener('change', renderBuilder));
renderBuilder();

$('#carouselPrev')?.addEventListener('click', () => {
  const nextIdx = (currentFinishSlide - 1 + BOX_FINISH_SLIDES.length) % BOX_FINISH_SLIDES.length;
  updateBuilderCarousel(nextIdx, true);
});
$('#carouselNext')?.addEventListener('click', () => {
  const nextIdx = (currentFinishSlide + 1) % BOX_FINISH_SLIDES.length;
  updateBuilderCarousel(nextIdx, true);
});
$$('.carousel-dot').forEach(dot => {
  dot.addEventListener('click', () => {
    const idx = Number(dot.dataset.slide);
    updateBuilderCarousel(idx, true);
  });
});

let touchStartX = 0;
let touchStartY = 0;
const carouselEl = $('#builderCarousel');
if (carouselEl) {
  carouselEl.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  carouselEl.addEventListener('touchend', e => {
    const deltaX = e.changedTouches[0].clientX - touchStartX;
    const deltaY = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(deltaX) > 36 && Math.abs(deltaX) > Math.abs(deltaY) * 1.4) {
      if (deltaX < 0) {
        updateBuilderCarousel((currentFinishSlide + 1) % BOX_FINISH_SLIDES.length, true);
      } else {
        updateBuilderCarousel((currentFinishSlide - 1 + BOX_FINISH_SLIDES.length) % BOX_FINISH_SLIDES.length, true);
      }
    }
  }, { passive: true });
}

$('#builderEnquire').addEventListener('click',()=>{const s=builderState();const lines=[`Hello ELORA! I'd like to build a personalised gift hamper.`,``,`Box: ${s.box}`,`Base hamper: ₹499`,...s.addons.map(a=>`+ ${a.name}: ${rupee(a.price)}`),``, `Estimated total: ${rupee(s.price)}`,`Occasion: ${s.occasion}`,s.recipient?`Recipient: ${s.recipient}`:'',s.message?`Gift note: ${s.message}`:'',``,`Please confirm the final contents, price and availability. Thank you!`].filter(v=>v!==undefined);showMessage('Your bespoke hamper',lines.join('\n'))});

$$('.occasion-card').forEach(b=>b.addEventListener('click',()=>{showMessage(`A little ${b.dataset.occasion} magic`,`Hello ELORA! I'm interested in a custom gift hamper for ${b.dataset.occasion}. Could you please share the gifting options, prices and personalisation details? Thank you!`)}));

$$('[data-gallery]').forEach(b=>b.addEventListener('click',()=>{$$('[data-gallery]').forEach(btn=>btn.classList.toggle('selected',btn===b));$('#galleryConcepts').hidden=b.dataset.gallery!=='concepts';$('#galleryOrders').hidden=b.dataset.gallery!=='orders';$('.gallery-note').hidden=b.dataset.gallery==='orders';}));
$$('[data-lightbox]').forEach(b=>b.addEventListener('click',()=>{$('#lightboxImage').src=b.dataset.lightbox;$('#lightboxImage').alt=$('img',b).alt;$('#lightboxCaption').textContent=b.dataset.caption;$('#lightbox').hidden=false;document.body.style.overflow='hidden'}));
function closeLightbox(){$('#lightbox').hidden=true;$('#lightboxImage').removeAttribute('src');document.body.style.overflow=''}$('#closeLightbox').addEventListener('click',closeLightbox);$('#lightbox').addEventListener('click',e=>{if(e.target.id==='lightbox')closeLightbox()});

$('#corporateForm').addEventListener('submit',event=>{event.preventDefault();const data=new FormData(event.currentTarget);const msg=`Hello ELORA! I'd like a corporate gifting quotation.\n\nCompany: ${data.get('company')}\nContact: ${data.get('name')}\nPhone: ${data.get('phone')}\nQuantity: ${data.get('quantity')} hampers\nBudget per hamper: ${data.get('budget')}\nOccasion: ${data.get('occasion')}\nAdditional details: ${data.get('notes')||'Not specified'}\n\nPlease share the available options and a quotation. Thank you!`;showMessage('Your corporate gifting brief',msg)});
$('#contactForm').addEventListener('submit',event=>{event.preventDefault();const d=new FormData(event.currentTarget);showMessage('Your message to ELORA',`Hello ELORA!\n\nName: ${d.get('name')}\nPhone: ${d.get('phone')}\nI'm looking for: ${d.get('interest')}\nBudget: ${d.get('budget')}\nMessage: ${d.get('message')||'Please contact me with more details.'}\n\nThank you!`)});

function showDialog(markup){$('#dialogContent').innerHTML=markup;$('#modalBackdrop').hidden=false;document.body.style.overflow='hidden';$('#dialogClose').focus();}
function closeDialog(){$('#modalBackdrop').hidden=true;document.body.style.overflow=''}
$('#dialogClose').addEventListener('click',closeDialog);$('#modalBackdrop').addEventListener('click',e=>{if(e.target===$('#modalBackdrop'))closeDialog()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(!$('#lightbox').hidden)closeLightbox();else if(!$('#modalBackdrop').hidden)closeDialog();else if(!$('#cartDrawer').hidden)toggleCart(false)}});
async function copyText(text){try{await navigator.clipboard.writeText(text);toast('Enquiry copied to clipboard')}catch{const t=document.createElement('textarea');t.value=text;document.body.appendChild(t);t.select();try{document.execCommand('copy');toast('Enquiry copied to clipboard')}catch{toast('Select and copy the enquiry text')}t.remove()}}
function openExternal(url){try{const a=document.createElement('a');a.href=url;a.target='_blank';a.rel='noopener noreferrer';document.body.appendChild(a);a.click();a.remove();return true}catch(e){return false}}
function launchWhatsApp(message){if(settings.whatsapp&&/^\d{10,15}$/.test(settings.whatsapp.replace(/\D/g,''))){return openExternal(`https://wa.me/${settings.whatsapp.replace(/\D/g,'')}?text=${encodeURIComponent(message)}`);}return false}
function showMessage(title,message){preparedMessage=message;const linked=!!settings.whatsapp;showDialog(`<div class="mini-kicker">THOUGHTFULLY CONNECTED</div><h3 id="dialogTitle">${escapeHtml(title)}</h3><p>Here's your ready-to-send enquiry. ${linked?'Open WhatsApp to send it to ELORA.':'The owner has not connected a business WhatsApp number yet. You can copy this message, or connect the number in owner settings.'}</p><div class="message-preview" id="messagePreview">${escapeHtml(message)}</div><div class="dialog-actions"><button class="btn btn-dark" id="copyPrepared">Copy enquiry ↗</button>${linked?'<button class="btn btn-outline" id="sendPrepared">Open WhatsApp ↗</button>':'<button class="btn btn-outline" id="setupFromDialog">Connect business number ↗</button>'}</div>`);$('#copyPrepared').addEventListener('click',()=>copyText(preparedMessage));if(linked)$('#sendPrepared').addEventListener('click',()=>launchWhatsApp(preparedMessage));else $('#setupFromDialog').addEventListener('click',showSetup)}
function showSetup(){showDialog(`<div class="mini-kicker">ELORA · WEBSITE SETUP</div><h3 id="dialogTitle">Connect your channels.</h3><p>This preview doesn't have ELORA's contact details. Add them here to test the links on this browser. For a live website, enter your real details in <strong>script.js → ELORA_CONFIG</strong> so every visitor sees them.</p><form class="setup-form" id="settingsForm"><label>WhatsApp business number (digits with country code)<input name="whatsapp" type="text" inputmode="numeric" value="${escapeHtml(settings.whatsapp)}" placeholder="e.g. 919876543210"></label><label>Instagram profile URL<input name="instagram" type="url" value="${escapeHtml(settings.instagram)}" placeholder="https://instagram.com/yourprofile"></label><label>Business email<input name="email" type="email" value="${escapeHtml(settings.email)}" placeholder="hello@yourdomain.com"></label><button class="btn btn-dark btn-full" type="submit">Save on this browser ↗</button><p>These settings remain in this browser only; they do not publish globally or send data to us.</p></form>`);$('#settingsForm').addEventListener('submit',e=>{e.preventDefault();const d=new FormData(e.currentTarget);const whatsapp=String(d.get('whatsapp')||'').replace(/\D/g,'');if(whatsapp&&(whatsapp.length<10||whatsapp.length>15)){toast('Please enter 10–15 digits including country code');return;}settings={whatsapp,instagram:String(d.get('instagram')||''),email:String(d.get('email')||'')};try { localStorage.setItem('elora_demo_links',JSON.stringify(settings)); } catch (error) { /* Settings remain usable in this tab. */ }closeDialog();toast('Links saved for this browser')});}
$('#openSetup').addEventListener('click',showSetup);
$$('[data-contact-action]').forEach(b=>b.addEventListener('click',()=>{const type=b.dataset.contactAction;if(type==='whatsapp'){if(!launchWhatsApp('Hello ELORA! I would love to learn more about your gift hampers.'))showMessage('Let’s chat on WhatsApp','Hello ELORA! I would love to know more about your gift hampers, prices, and how to place an order. Thank you!')}else if(type==='instagram'){if(settings.instagram&&/^https:\/\//.test(settings.instagram))openExternal(settings.instagram);else showSetup()}else if(type==='email'){if(settings.email)window.location.href=`mailto:${encodeURIComponent(settings.email)}?subject=ELORA%20Gifting%20Enquiry`;else showSetup()}}));

const backToTopBtn = $('#backToTop');
function updateBackToTopVisibility() {
  const scrolled = window.pageYOffset || document.documentElement.scrollTop || window.scrollY || 0;
  if (scrolled > 280) {
    backToTopBtn?.classList.add('show');
  } else {
    backToTopBtn?.classList.remove('show');
  }
}
window.addEventListener('scroll', updateBackToTopVisibility, { passive: true });
updateBackToTopVisibility();

function scrollToMainHome(e) {
  if (e) e.preventDefault();
  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  if (window.history.pushState) {
    window.history.pushState(null, '', '#home');
  }
  $$('.desktop-nav a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#home'));
}
backToTopBtn?.addEventListener('click', scrollToMainHome);
$('#footerBackToTop')?.addEventListener('click', scrollToMainHome);

