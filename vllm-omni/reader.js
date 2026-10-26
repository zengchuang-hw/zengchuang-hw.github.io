(() => {
  const frame=document.getElementById('report-frame'), dates=document.getElementById('dates');
  let list=Array.from(dates.querySelectorAll('a')).map(a=>({file:a.dataset.report,label:a.textContent,date:a.dataset.report.match(/\d{4}-\d{2}-\d{2}/)[0]}));
  function select(){
    let hash='';try{hash=decodeURIComponent(location.hash.slice(1));}catch(e){}
    const item=list.find(x=>x.file==='reports/'+hash)||list[0];
    frame.contentWindow.location.replace(new URL('../'+item.file,location.href).href);
    frame.dataset.report=item.file;
    document.getElementById('standalone').href='../'+item.file;
    document.getElementById('selected-label').textContent=item.date+' · 贡献周报';
    dates.querySelectorAll('a').forEach(a=>a.setAttribute('aria-current',String(a.dataset.report===item.file)));
  }
  window.addEventListener('hashchange',select);select();
  fetch('../reports/list.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error(r.status);return r.json();}).then(items=>{
    const safe=items.filter(x=>typeof x.file==='string'&&/^reports\/weekly-\d{4}-\d{2}-\d{2}\.html$/.test(x.file));
    if(!safe.length)return;list=safe;
    dates.replaceChildren();const archive=document.getElementById('archive-list');archive.replaceChildren();
    safe.forEach(item=>{
      const a=document.createElement('a');a.href='#'+item.file.split('/').pop();a.dataset.report=item.file;a.textContent=item.label;dates.append(a);
      const li=document.createElement('li'),link=document.createElement('a');link.href='../'+item.file;link.textContent=item.date+' · '+item.label;li.append(link);archive.append(li);
    });select();
  }).catch(()=>{/* Static archive and initial reader remain available. */});
})();
