'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [q, setQ] = useState('');
  const [list, setList] = useState([]);
  const [load, setLoad] = useState(false);

  const search = async (e) => {
    e.preventDefault();
    setLoad(true);
    setList([]); 
    try {
      const res = await fetch('/api/proxy', {
        method: 'POST',
        body: JSON.stringify({ endpoint: 'search', payload: { keyword: q } })
      });
      const data = await res.json();
      // الموقع الأصلي يرجع البيانات أحياناً في data.results وأحياناً results مباشرة
      setList(data.data?.results || data.results || []);
    } catch (e) { alert('خطأ في الاتصال'); }
    setLoad(false);
  };

  return (
    <div style={{background:'#000', color:'#fff', minHeight:'100vh', padding:'20px', fontFamily:'sans-serif'}} dir="rtl">
      <h1 style={{color:'red', textAlign:'center'}}>سينما (اتصال مباشر) ⚡</h1>
      
      <form onSubmit={search} style={{display:'flex', gap:'10px', marginBottom:'20px', justifyContent:'center'}}>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="ابحث هنا..." style={{padding:'12px', borderRadius:'8px', border:'none', width:'70%'}}/>
        <button style={{background:'red', color:'white', border:'none', padding:'10px 20px', borderRadius:'8px', fontWeight:'bold'}}>بحث</button>
      </form>

      {load && <p style={{textAlign:'center', color:'gray'}}>جاري الاتصال بالمصدر...</p>}

      <div style={{display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:'15px'}}>
        {list.map(i => (
          <Link key={i.id} href={`/watch/${i.bookId || i.id}`} style={{textDecoration:'none', color:'white'}}>
            <div style={{background:'#1a1a1a', borderRadius:'10px', overflow:'hidden', border:'1px solid #333'}}>
              <img src={i.cover || i.poster} style={{width:'100%', aspectRatio:'2/3', objectFit:'cover'}}/>
              <div style={{padding:'8px', fontSize:'13px', textAlign:'center', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>
                {i.title}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

