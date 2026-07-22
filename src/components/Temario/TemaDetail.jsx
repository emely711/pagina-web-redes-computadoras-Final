import { useParams, Link } from 'react-router-dom';
import './TemaDetail.css'; 

export default function TemaDetail() {
  const { temaSlug } = useParams();

  const formatTitle = (slug) => {
    return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  return (
    <div className="tema-detail-container">
      <div className="container">
        <Link to="/temario" className="back-link">← Volver al temario</Link>
        
        <article className="tema-article">
          <header className="tema-article-header">
            <h1>{formatTitle(temaSlug)}</h1>
            <div className="divider"></div>
          </header>

          <div className="tema-content-body">
            <p>Bienvenido al módulo de <strong>{formatTitle(temaSlug)}</strong>. Aquí podrás profundizar en todos los conceptos técnicos.</p>
            
            {/* Lógica para mostrar contenido específico */}
            {temaSlug === 'modelo-osi' && (
              <div className="info-box">
                <p>El Modelo OSI divide la comunicación de red en 7 capas conceptuales para estandarizar el envío de datos.</p>
                              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  );
}