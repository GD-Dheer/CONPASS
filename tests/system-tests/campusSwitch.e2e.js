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
  console.log('The configuration has successfully been loaded and the device emulator should now begin opening the application.');
  await driver.sleep(58000); // wait for app to load
});

test('campusSwitch - Should click on the Loyola', async () => {
  const searchBarXPath = '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.EditText';
  const searchBarElement = await driver.elementsByXPath(searchBarXPath);
  console.log('AppiumLog-editable searchBar component is present');
  await driver.clickElement(searchBarElement);
  const action = new wd.TouchAction(driver);
  await action.press({ x: 806, y: 258 });
  action.release();
  await action.tap({ x: 806, y: 258 });
  console.log('Tap worked');
  await driver.performTouchAction(action);
  expect([{ action: 'press', options: { x: 806, y: 258 } },
    { action: 'release', options: {} },
    { action: 'tap', options: { x: 806, y: 258 } }]).toStrictEqual(action.toJSON());
});

test('campusSwitch - Should click on the SGW', async () => {
  const searchBarXPath = '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.EditText';
  const searchBarElement = await driver.elementsByXPath(searchBarXPath);
  console.log('AppiumLog-editable searchBar component is present');
  await driver.clickElement(searchBarElement);
  const action = new wd.TouchAction(driver);
  await action.press({ x: 270, y: 270 });
  action.release();
  await action.tap({ x: 270, y: 270 });
  console.log('Tap worked');
  await driver.performTouchAction(action);
  expect([{ action: 'press', options: { x: 270, y: 270 } },
    { action: 'release', options: {} },
    { action: 'tap', options: { x: 270, y: 270 } }]).toStrictEqual(action.toJSON());
});
