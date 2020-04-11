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

// Checking the S building specifically
test('showBuildingInfo', async () => {
  const actionZoomIn = new wd.TouchAction(driver);
  actionZoomIn.tap({ x: 625, y: 742 });
  actionZoomIn.release();
  await driver.performTouchAction(actionZoomIn);
  const action = new wd.TouchAction(driver);
  action.tap({ x: 859, y: 1172 });
  action.release();
  await driver.performTouchAction(action);
  await driver.sleep(5000); // Must wait for the click to fully load
  el = await driver.elementsByXPath('/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[4]/android.widget.HorizontalScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ImageView');
  expect(el).toBeDefined();
});
