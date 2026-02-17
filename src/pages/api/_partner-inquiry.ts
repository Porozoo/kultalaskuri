import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase/client';

// Yksinkertainen rate limiting
const submissions = new Map<string, number[]>();
const MAX_PER_HOUR = 5;

export const POST: APIRoute = async ({ request, clientAddress }) => {
  try {
    // 1. Rate limiting
    const ip = clientAddress || 'unknown';
    const now = Date.now();
    const hourAgo = now - 60 * 60 * 1000;
    
    const userSubmissions = submissions.get(ip) || [];
    const recentSubmissions = userSubmissions.filter(time => time > hourAgo);
    
    if (recentSubmissions.length >= MAX_PER_HOUR) {
      return new Response(
        JSON.stringify({ error: 'Liian monta yritystä. Odota hetki.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // 2. Lue data
    const body = await request.json();
    const { company, contact, email, phone, city, message } = body;
    
    // 3. Validoi
    if (!company || !contact || !email || !city) {
      return new Response(
        JSON.stringify({ error: 'Pakolliset kentät puuttuvat' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Virheellinen sähköposti' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // 4. Sanitoi
    const sanitize = (str: string | null): string | null => {
      if (!str) return null;
      return str.trim().slice(0, 1000).replace(/<[^>]*>/g, '');
    };
    
    const cleanData = {
      company_name: sanitize(company),
      contact_name: sanitize(contact),
      email: email.toLowerCase().trim(),
      phone: sanitize(phone),
      city: sanitize(city),
      message: sanitize(message),
      source: 'website_form',
      created_at: new Date().toISOString(),
    };
    
    // 5. Tallenna (jos Supabase on käytössä)
    if (supabase) {
      const { error } = await supabase
        .from('partner_inquiries')
        .insert(cleanData);
      
      if (error) {
        console.error('Supabase error:', error);
        // Jatka silti - logita ainakin konsoliin
      }
    }
    
    // Logita konsoliin (näet terminaalissa)
    console.log('📧 Uusi kumppanikysey:', cleanData);
    
    // 6. Päivitä rate limiting
    recentSubmissions.push(now);
    submissions.set(ip, recentSubmissions);
    
    // 7. Onnistui
    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('API error:', error);
    return new Response(
      JSON.stringify({ error: 'Palvelinvirhe' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};