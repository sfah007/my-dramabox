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
    try {
      const res = await fetch('/api/proxy', {
        method: 'POST',
        body: JSON.stringify({ endpoint: 'search', payload: { keyword: q } })
      });
      const data = await res.json();
      setList(data.data?.results || []);
    } catch (e) {}
    setLoad(false);
  };

  return (
    <div style={{background:'#000', color:'#fff', minHeight:'100vh', padding:'20px', fontFamily:'sans-serif'}} dir="rtl">
      <h1 style={{color:'red', textAlign:'center'}}>DramaBox 🔥</h1>
      <form onSubmit={search} style={{display:'flex', gap:'10px', marginBottom:'20px'}}>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="اسم المسلسل..." style={{flex:1, padding:'10px', borderRadius:'5px'}}/>
        <button style={{background:'red', color:'white', border:'none', padding:'10px 20px', borderRadius:'5px'}}>بحث</button>
      </form>
      {load && <p style={{textAlign:'center'}}>جاري البحث...</p>}
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px'}}>
        {list.map(i => (
          <Link key={i.id} href={`/watch/${i.bookId || i.id}`} style={{textDecoration:'none', color:'white'}}>
            <div style={{background:'#111', borderRadius:'10px', overflow:'hidden'}}>
              <img src={i.cover} style={{width:'100%', aspectRatio:'2/3', objectFit:'cover'}}/>
              <p style={{padding:'5px', fontSize:'12px', textAlign:'center'}}>{i.title}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
