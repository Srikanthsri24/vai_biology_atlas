export function catalogPreviewModel(model:string):string {
 return ['body','male','female','integumentary-system'].includes(model)?'skeletal-body':model;
}
export function isDedicatedPreview(model:string,context:'public'|'study'='public'):boolean { return context==='public'&& ['male-reproductive','female-reproductive'].includes(model); }
