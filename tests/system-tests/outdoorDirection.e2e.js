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

test('outdoor direction, path should be drawn on the map', async () => {
  const action = new wd.TouchAction(driver);
  await action.tap({ x: 976, y: 1535 });
  action.release();
  console.log('Tap worked');
  await driver.performTouchAction(action);
  const destXpath = '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[4]/android.view.ViewGroup/android.view.ViewGroup/android.widget.EditText';
  const TEXT = 'Boulevard de Maisonneuve O, Montreal, QC H3G 1M8';
  const element = await driver.elementsByXPath(destXpath);
  await driver.clickElement(element);
  console.log('AppiumLog-textfield is clickable');
  await driver.type(element, TEXT);
  await driver.pressKeycode(66);
  expect(element).toBeDefined();
});
