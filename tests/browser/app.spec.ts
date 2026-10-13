import {test,expect} from '@playwright/test';
async function openApp(page:import('@playwright/test').Page){await page.goto('/');await expect(page.locator('input[type=password]')).toHaveCount(0);await expect(page.getByRole('heading',{name:'오늘도, 한 걸음 더.'})).toBeVisible()}
test('Galaxy sized layout, full learning loop and persisted cross-device progress',async({page,browser})=>{
  await page.setViewportSize({width:412,height:915});
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await openApp(page);
  await expect(page.locator('.mobile-nav')).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
  await page.goto('/#/learn');await page.getByLabel('개념 검색').fill('RAG');
  await expect(page.locator('.concept-row').first()).toBeVisible();await page.locator('.concept-row').first().click();
  await expect(page.locator('.summary')).toBeVisible();
  await page.locator('.quiz').first().locator('.option').first().click();
  await page.locator('.quiz').first().getByRole('button',{name:'정답 확인'}).click();
  await expect(page.locator('.quiz').first().locator('.feedback')).toBeVisible();
  await page.getByRole('button',{name:'개념 북마크'}).click();
  await expect(page.getByRole('button',{name:'개념 북마크'})).toHaveClass(/saved/);
  const conceptHash=new URL(page.url()).hash;
  await page.reload();await expect(page.locator('.lesson')).toBeVisible();
  await expect(page.getByRole('button',{name:'개념 북마크'})).toHaveClass(/saved/);
  const context2=await browser.newContext({viewport:{width:1440,height:1000}});const desktop=await context2.newPage();
  await openApp(desktop);await desktop.goto('/'+conceptHash);await expect(desktop.getByRole('button',{name:'개념 북마크'})).toHaveClass(/saved/);
  await desktop.screenshot({path:'test-results/desktop-lesson.png',fullPage:true});await context2.close();
  await page.goto('/#/review');await page.locator('.flashcard').click();await page.getByRole('button',{name:'빠르게 복습 헷갈림'}).click();
  await expect(page.locator('.review-top')).toContainText('2 /');
  await page.goto('/#/compare');await expect(page.locator('.compare-table')).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
  await page.goto('/#/scenarios');await page.locator('.scenario .option').first().click();await page.getByRole('button',{name:'내 판단과 권장 접근 비교'}).click();await expect(page.locator('.feedback')).toContainText('결과를 검증하는 방법');
  await page.goto('/#/');await page.screenshot({path:'test-results/galaxy-home.png',fullPage:true});
  expect(errors).toEqual([]);
});
test('exam autosave survives page reload and produces results',async({page})=>{
  await page.setViewportSize({width:412,height:915});await openApp(page);await page.goto('/#/exams');
  // Start through the API, then exercise the actual browser route and interactions.
  const exam=await page.evaluate(async()=>{const r=await fetch('/api/exams',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({mode:'A'})});return r.json()});
  await page.goto('/#/exams/'+exam.id);
  await expect(page.locator('.option').first()).toBeVisible();await page.locator('.option').first().click();
  await expect.poll(async()=>page.evaluate(async(id)=>{const r=await fetch('/api/exams/'+id);return Object.keys((await r.json()).answers).length},exam.id)).toBeGreaterThan(0);
  await page.reload();await expect(page.locator('.option').first()).toHaveClass(/selected/);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
  const submitted=await page.evaluate(async(id)=>{const r=await fetch('/api/exams/'+id+'/submit',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'});return r.json()},exam.id);
  expect(submitted.results).toHaveLength(20);await page.reload();await expect(page.getByText('영역별 정답률')).toBeVisible();
});


test('small mobile screens retain readable navigation without horizontal overflow',async({page})=>{
  await page.setViewportSize({width:360,height:800});await openApp(page);
  for(const route of ['/learn','/review','/compare','/scenarios','/notes','/stats','/settings','/exams']){
    await page.goto('/#'+route);
    await expect(page.locator('main h1').first()).toBeVisible();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),route).toBe(true);
  }
});
