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

test('nextSguttleTime: next shuttle time should display', async () => {
  const action = new wd.TouchAction(driver);
  await action.tap({ x: 976, y: 1535 });
  action.release();
  console.log('Tap worked');
  await driver.performTouchAction(action);
  const busXpath = '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[6]/android.view.ViewGroup/android.view.ViewGroup/android.widget.ImageView';
  const shuttleBusElement = await driver.elementsByXPath(busXpath);
  const action2 = new wd.TouchAction(driver);
  await action2.tap({ x: 417, y: 371 });
  action2.release();
  await driver.performTouchAction(action2);
  expect(shuttleBusElement).toBeDefined();
});
