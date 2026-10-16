import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Button } from '@/components/ui/button';
import { Bold, Italic, List, ListOrdered, Undo2, Redo2, Heading2, Link2 } from 'lucide-react';

export function RichEditor({value,onChange}:{value:string,onChange:(v:string)=>void}){
  const editor=useEditor({extensions:[StarterKit],content:value,immediatelyRender:false,onUpdate:({editor})=>onChange(editor.getHTML()),editorProps:{attributes:{class:'cms-editor min-h-64 p-4 outline-none'}}});
  if(!editor)return <div className="min-h-64 bg-muted rounded-md"/>;
  const tools=[
    {label:'Gras',icon:Bold,run:()=>editor.chain().focus().toggleBold().run()},
    {label:'Italique',icon:Italic,run:()=>editor.chain().focus().toggleItalic().run()},
    {label:'Titre',icon:Heading2,run:()=>editor.chain().focus().toggleHeading({level:2}).run()},
    {label:'Liste',icon:List,run:()=>editor.chain().focus().toggleBulletList().run()},
    {label:'Liste numérotée',icon:ListOrdered,run:()=>editor.chain().focus().toggleOrderedList().run()},
    {label:'Lien',icon:Link2,run:()=>{const url=prompt('Adresse du lien (https://…)');if(url && /^https:\/\//i.test(url))editor.chain().focus().setLink({href:url}).run();}},
    {label:'Annuler',icon:Undo2,run:()=>editor.chain().focus().undo().run()},
    {label:'Rétablir',icon:Redo2,run:()=>editor.chain().focus().redo().run()},
  ];
  return <div className="border border-input rounded-md bg-background"><div className="flex flex-wrap gap-1 border-b border-border p-2">{tools.map(t=><Button key={t.label} type="button" variant="ghost" size="icon" title={t.label} aria-label={t.label} onClick={t.run}><t.icon/></Button>)}</div><EditorContent editor={editor}/></div>;
}