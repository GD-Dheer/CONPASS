/* eslint-disable no-undef */
import wd from 'wd';
import APK_PATH from './systemTestSetup';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 120000;

const PORT = 4723;
const config = {
  platformName: 'Android',
  deviceName: 'emulator-5554',
  app: APK_PATH, // relative to root of project
  automationName: 'UiAutomator2',
  appWaitForLaunch: false
};
const driver = wd.promiseChainRemote('localhost', PORT);

beforeAll(async () => {
  await driver.init(config);
  console.log('DONE');
  await driver.sleep(58000); // wait for app to load
});

test('verify that the shuttle schedule displays', async () => {
  let menu = await driver.elementsByXPath('/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.view.ViewGroup[2]/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.RelativeLayout[2]');
  if (!menu) { console.log('Menu is not present'); }
  const element = await driver.elementsByXPath('/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ImageView');
  if (element) { console.log('AppiumLog-burger icon is present'); } else { console.log('AppiumLog-burger icon is not present'); }
  await driver.clickElement(element);
  console.log('AppiumLog-burger is clickable');
  menu = await driver.elementsByXPath('/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.view.ViewGroup[2]/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.RelativeLayout[2]');
  expect(menu).toBeDefined();
  const action = new wd.TouchAction(driver);
  await action.tap({ x: 171, y: 575 });
  action.release();
  console.log('Tap worked');
  await driver.performTouchAction(action);
  const loyXpath = '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/android.view.ViewGroup[2]/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.view.ViewGroup/android.view.ViewGroup[2]/android.view.ViewGroup/android.widget.TextView';
  const sgwXpath = '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/android.view.ViewGroup[2]/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.view.ViewGroup/android.view.ViewGroup[1]/android.view.ViewGroup/android.widget.TextView';
  const loyElement = await driver.elementsByXPath(loyXpath);
  const sgwElement = await driver.elementsByXPath(sgwXpath);
  expect(loyElement).toBeDefined();
  expect(sgwElement).toBeDefined();
});
