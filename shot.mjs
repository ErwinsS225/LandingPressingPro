export default async function run(page) {
  const id = "tarifs";
  const y0 = await page.evaluate((i) => document.querySelector("#" + i).offsetTop, id);
  const total = await page.evaluate(
    (i) => document.querySelector("#" + i).offsetHeight - window.innerHeight, id);
  const at = Number(process.env.AT ?? 0.5);
  await page.evaluate((y) => window.scrollTo(0, y), y0 + total * at);
  await page.waitForTimeout(900);
  await page.screenshot({ path: process.env.OUT ?? "/tmp/step.png" });
  return { ok: true, at };
}