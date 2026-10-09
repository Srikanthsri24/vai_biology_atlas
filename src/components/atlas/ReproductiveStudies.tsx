import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export default function ReproductiveStudies({lessons=false}:{lessons?:boolean}) {
 const studies=lessons?[
  {title:'The ovarian cycle',route:'/systems/female-reproductive/ovaries?simulation=ovarian',text:'Four explained stages with interactive 3D teaching markers.'},
  {title:'Through the uterine tube',route:'/systems/female-reproductive/uterine-tubes?simulation=tubal',text:'Trace the relationship between the ovaries, tubes and uterus.'}
 ]:[
  {title:'Male Reproductive System',route:'/systems/male-reproductive',text:'Explore the testes, ducts, prostate and related structures.'},
  {title:'Female Reproductive System',route:'/systems/female-reproductive',text:'Explore the ovaries, uterine tubes, uterus, cervix and vagina.'}
 ];
 return <section className="reproductive-studies" aria-label={lessons?'Female physiology lessons':'Reproductive system studies'}>
  <h2>{lessons?'Female physiology lessons':'Reproductive anatomy'}</h2>
  <div>{studies.map(s=><Link to={s.route} key={s.route}><strong>{s.title}<ArrowUpRight size={16}/></strong><span>{s.text}</span></Link>)}</div>
  <p>Female studies use labelled schematic 3D anatomy. Open a study to rotate, select and explore its structures.</p>
 </section>;
}
