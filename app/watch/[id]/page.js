'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

export default function Watch({ params }) {
  // فك الـ Promise (تحديث Next.js 15)
  const [id, setId] = useState(null);
  useEffect(() => { Promise.resolve(params).then(p => setId(p.id)); }, [params]);

  const [d, setD] = useState(null);
  const [url, setUrl] = useState('');
  const [idx, setIdx] = useState(0);
  const [loading, setLoading] = useState(false);

  // جلب التفاصيل
  useEffect(() => {
    if(!id) return;
    fetch('/api/proxy', {
      method: 'POST',
      body: JSON.stringify({ endpoint: 'detail', payload: { bookId: id } })
    }).then(r=>r.json()).then(res => setD(res.data));
  }, [id]);

  // تشغيل الفيديو
  const play = async (i) => {
    setIdx(i);
    setUrl('');
    setLoading(true);
    
    // معادلة الـ 5 حلقات (ضرورية للموقع الأصلي)
    const boundary = Math.floor(i / 5) * 5; 

    try {
      const res = await fetch('/api/proxy', {
          method: 'POST',
          body: JSON.stringify({ 
              endpoint: 'player', 
              payload: { bookId: id, index: i, boundaryIndex: boundary } 
          })
      });
      const data = await res.json();
      
      if(data.data?.url) {
          setUrl(data.data.url);
      } else {
          alert('فيديو غير متاح أو محمي');
      }
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  if (!d) return <div style={{background:'black', color:'white', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center'}}>جاري التحميل...</div>;

  return (
    <div style={{background:'black', color:'white', minHeight:'100vh', display:'flex', flexDirection:'column'}} dir="rtl">
      
      {/* مشغل الفيديو */}
      <div style={{width:'100%', aspectRatio:'16/9', background:'#111', position:'sticky', top:0, zIndex:100}}>
         {loading && <div style={{position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', color:'red'}}>جاري جلب الرابط...</div>}
         {url ? <ReactPlayer url={url} width="100%" height="100%" playing controls config={{file:{forceHLS:true}}}/> 
              : !loading && <div style={{height:'100%', display:'flex', alignItems:'center', justifyContent:'center', color:'gray'}}>اضغط حلقة بالأسفل 👇</div>}
      </div>
      
      {/* المعلومات والحلقات */}
      <div style={{padding:'15px', flex:1, overflowY:'auto'}}>
        <h2 style={{fontSize:'18px', color:'red', marginBottom:'5px'}}>{d.title}</h2>
        <p style={{fontSize:'12px', color:'gray', marginBottom:'15px'}}>الحلقات: {d.chapterCount}</p>
        
        <div style={{display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:'8px'}}>
           {Array.from({length: d.chapterCount || 10}).map((_, i) => (
             <button key={i} onClick={()=>play(i)} 
               style={{
                   padding:'12px', 
                   background: idx===i?'red':'#222', 
                   color: idx===i?'white':'#aaa', 
                   border:'none', 
                   borderRadius:'8px',
                   fontWeight:'bold'
               }}>
               {i+1}
             </button>
           ))}
        </div>
      </div>
    </div>
  );
}

