"use client";
import React, { useEffect, useState } from "react";
const messages = ["Ищем визуальные следы кампуса", "Сверяем источники и убираем повторы", "Ещё чуть-чуть — собираем профиль"];
export const SearchLoading = () => { const [message, setMessage] = useState(0); useEffect(() => { const id = setInterval(() => setMessage((value) => (value + 1) % messages.length), 1800); return () => clearInterval(id); }, []); return <section className="loading-screen shell"><div className="loading-dots"><i /><i /><i /></div><p>{messages[message]}</p><small>Обычно это занимает несколько секунд</small></section> };
