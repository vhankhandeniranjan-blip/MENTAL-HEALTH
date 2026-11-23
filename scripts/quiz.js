const questions = [{"question": "What does mental health describe?", "options": ["Only physical fitness", "How we think, feel and behave", "Only academic performance", "Only sleeping habits"], "answer": 1, "explanation": "Mental health includes our thoughts, feelings and behaviour."}, {"question": "Which is a helpful first response when a friend shares a concern?", "options": ["Listen without judging", "Make jokes about it", "Share it with classmates", "Tell them to ignore it"], "answer": 0, "explanation": "Listening respectfully can help a friend feel heard. Encourage support from a trusted adult when needed."}, {"question": "What is one healthy way to approach a large school task?", "options": ["Avoid it completely", "Try to finish everything without breaks", "Divide it into smaller steps", "Compare your progress with everyone"], "answer": 2, "explanation": "Smaller steps can make a demanding task feel more manageable."}, {"question": "Which statement about emotions is most accurate?", "options": ["Only positive emotions are acceptable", "Everyone should feel the same way", "Difficult feelings mean someone has failed", "All feelings deserve to be noticed and understood"], "answer": 3, "explanation": "Feelings are part of being human; noticing them can help us decide what support we need."}, {"question": "What is a respectful response to bullying?", "options": ["Join in so you fit in", "Support the person and tell a trusted adult", "Spread the story online", "Blame the person being bullied"], "answer": 1, "explanation": "Bullying should be taken seriously. A trusted adult can help address it safely."}, {"question": "Which habit can support everyday wellbeing?", "options": ["Regular rest and enjoyable activity", "Skipping breaks every day", "Staying online all night", "Keeping every worry secret"], "answer": 0, "explanation": "Rest and enjoyable activities can support general wellbeing."}, {"question": "Why can comparing ourselves with social media posts be misleading?", "options": ["Every post shows a full daily reality", "Online posts always show the whole context", "Posts may show selected moments, not the full picture", "Everyone has the same experiences"], "answer": 2, "explanation": "People often share selected moments, so a post rarely shows the whole context."}, {"question": "Who can a young person approach when a problem feels difficult to manage?", "options": ["No one; they must solve it alone", "Only strangers online", "A trusted adult such as a parent, teacher or counsellor", "Anyone who promises to keep every secret"], "answer": 2, "explanation": "A trusted adult can help a young person find appropriate support."}];

(() => {
 const questionEl=document.getElementById('quiz-question'), optionsEl=document.getElementById('quiz-options');
 if(!questionEl||!optionsEl)return;
 const countEl=document.getElementById('quiz-count'), fill=document.getElementById('quiz-fill'), feedback=document.getElementById('quiz-feedback');
 const next=document.getElementById('quiz-next'), content=document.getElementById('quiz-content'), result=document.getElementById('quiz-result');
 const scoreEl=document.getElementById('quiz-score'), resultText=document.getElementById('quiz-result-text'), restart=document.getElementById('quiz-restart');
 let index=0,score=0,locked=false;
 function render(){
  locked=false; const q=questions[index]; questionEl.textContent=q.question; optionsEl.replaceChildren();
  q.options.forEach((label,i)=>{const b=document.createElement('button');b.type='button';b.className='quiz-choice';
   const letter=document.createElement('span');letter.className='choice-letter';letter.textContent=String.fromCharCode(65+i);
   const text=document.createElement('span');text.textContent=label;b.append(letter,text);
   b.addEventListener('click',()=>choose(i,b));optionsEl.append(b);});
  countEl.textContent=`Question ${index+1} of ${questions.length}`;fill.style.width=`${index/questions.length*100}%`;
  feedback.textContent='';next.disabled=true;next.textContent=index===questions.length-1?'View results':'Next question';
 }
 function choose(choice,button){
  if(locked)return;locked=true;const q=questions[index];const all=[...optionsEl.querySelectorAll('button')];
  all.forEach((b,i)=>{b.disabled=true;if(i===q.answer)b.classList.add('correct');});
  if(choice===q.answer){score++;feedback.textContent='✓ '+q.explanation;feedback.style.color='#237b65';}
  else{button.classList.add('wrong');feedback.textContent='Not quite. '+q.explanation;feedback.style.color='#a64f45';}
  next.disabled=false;fill.style.width=`${(index+1)/questions.length*100}%`;
 }
 next.addEventListener('click',()=>{if(!locked)return;if(index<questions.length-1){index++;render();}else showResult();});
 function showResult(){content.hidden=true;result.hidden=false;scoreEl.textContent=`${score}/${questions.length}`;
  const pct=score/questions.length;if(pct===1)resultText.textContent='Excellent work! You have a strong understanding of these awareness topics.';
  else if(pct>=.625)resultText.textContent='Good effort! Review the explanations and keep learning.';
  else resultText.textContent='Thanks for taking part. Explore the website and try again when you are ready.';}
 restart.addEventListener('click',()=>{index=0;score=0;result.hidden=true;content.hidden=false;render();});
 render();
})();
