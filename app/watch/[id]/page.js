'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
// استيراد المشغل
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

export default function Watch({ params }) {
  // فك الـ Promise الخاص بـ params (تحديث Next.js الجديد)
  const [id, setId] = useState(null);
  
  useEffect(() => {
    // التعامل مع params سواء كانت كائن أو Promise
    Promise.resolve(params).then(p => setId(p.id));
  }, [params]);

  const [d, setD] = useState(null);
  const [url, setUrl] = useState('');
  const [idx, setIdx] = useState(0);

  // جلب التفاصيل
  useEffect(() => {
    if(!id) return;
    fetch('/api/proxy', {
      method: 'POST',
      body: JSON.stringify({ endpoint: 'detail', payload: { bookId: id } })
    }).then(r=>r.json()).then(res => setD(res.data));
  }, [id]);

  // دالة التشغيل
  const play = async (i) => {
    setIdx(i);
    setUrl('');
    const boundary = Math.floor(i / 5) * 5; // معادلة الـ 5 حلقات
    const res = await fetch('/api/proxy', {
        method: 'POST',
        body: JSON.stringify({ 
            endpoint: 'player', 
            payload: { bookId: id, index: i, boundaryIndex: boundary } 
        })
    });
    const data = await res.json();
    if(data.data?.url) setUrl(data.data.url);
  };

  if (!d) return <div style={{background:'black', color:'white', height:'100vh', padding:'20px'}}>جاري التحميل...</div>;

  return (
    <div style={{background:'black', color:'white', minHeight:'100vh'}} dir="rtl">
      {/* الفيديو */}
      <div style={{position:'sticky', top:0, zIndex:10, background:'black', width:'100%', aspectRatio:'16/9'}}>
         {url ? <ReactPlayer url={url} width="100%" height="100%" playing controls config={{file:{forceHLS:true}}}/> 
              : <div style={{display:'flex', alignItems:'center', justifyContent:'center', height:'100%'}}>اختر حلقة 👇</div>}
      </div>
      
      {/* القائمة */}
      <div style={{padding:'10px'}}>
        <h3>{d.title}</h3>
        <p>الحلقات:</p>
        <div style={{display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:'5px'}}>
           {Array.from({length: d.chapterCount || 10}).map((_, i) => (
             <button key={i} onClick={()=>play(i)} 
               style={{
                   padding:'10px', 
                   background: idx===i?'red':'#333', 
                   color:'white', 
                   border:'none', 
                   borderRadius:'5px'
               }}>
               {i+1}
             </button>
           ))}
        </div>
      </div>
    </div>
  );
}
