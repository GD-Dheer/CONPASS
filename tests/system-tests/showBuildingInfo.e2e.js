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

test('showBuildingInfo', async () => {
  const actionZoomIn = new wd.TouchAction(driver);
  actionZoomIn.tap({ x: 656, y: 727 });
  actionZoomIn.release();
  await driver.performTouchAction(actionZoomIn);
  console.log('SHOULD BE ZOOMED IN');
  const action = new wd.TouchAction(driver);
  action.release();
  action.press({ x: 503, y: 1616 });
  action.moveTo({ x: 503, y: 379 });
  action.release();
  action.tap({ x: 853, y: 1509 });
  action.release();
  await driver.performTouchAction(action);
});
