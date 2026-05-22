/* ===== Language toggle + persistence via URL param ===== */
(function(){
  var current = 'pt';

  function getInitial(){
    var m = location.search.match(/[?&]lang=(pt|en)/);
    return m ? m[1] : 'pt';
  }

  function apply(lang, updateURL){
    current = lang;
    document.querySelectorAll('[data-lang]').forEach(function(el){
      el.classList.toggle('show', el.getAttribute('data-lang') === lang);
    });
    document.querySelectorAll('.lang-toggle button').forEach(function(b){
      b.classList.toggle('active', b.getAttribute('data-set') === lang);
    });
    document.documentElement.setAttribute('lang', lang === 'pt' ? 'pt-BR' : 'en');

    // Update closed-source badges' title attribute to match language
    document.querySelectorAll('.closed-src').forEach(function(el){
      var t = el.getAttribute('data-title-' + lang);
      if(t){ el.setAttribute('title', t); }
    });

    // Patch internal .html links so the chosen language carries across pages
    document.querySelectorAll('a[href]').forEach(function(a){
      var href = a.getAttribute('href');
      if(!href) return;
      if(/^(https?:|mailto:|tel:|#)/i.test(href)) return;
      if(!/\.html(\?|$)/i.test(href)) return;
      var clean = href.replace(/([?&])lang=(pt|en)(&|$)/,'$1').replace(/[?&]$/,'');
      var sep = clean.indexOf('?') >= 0 ? '&' : '?';
      a.setAttribute('href', clean + sep + 'lang=' + lang);
    });

    if(updateURL){
      var url = new URL(location.href);
      url.searchParams.set('lang', lang);
      history.replaceState(null, '', url.toString());
    }
  }

  document.addEventListener('DOMContentLoaded', function(){
    document.querySelectorAll('.lang-toggle button').forEach(function(b){
      b.addEventListener('click', function(){
        apply(b.getAttribute('data-set'), true);
      });
    });

    apply(getInitial(), false);

    var here = (location.pathname.split('/').pop() || 'index.html').split('?')[0];
    document.querySelectorAll('.nav-links a').forEach(function(a){
      var hrefFile = a.getAttribute('href').split('?')[0];
      if(hrefFile === here){ a.classList.add('active'); }
    });

    var typed = document.getElementById('typed-cmd');
    if(typed){
      var full = typed.getAttribute('data-text') || '';
      typed.textContent = '';
      var i = 0;
      (function step(){
        if(i <= full.length){
          typed.textContent = full.slice(0,i);
          i++;
          setTimeout(step, 38);
        }
      })();
    }
  });
})();
