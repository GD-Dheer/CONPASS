/* eslint-disable no-undef */
import wd from 'wd';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 120000;

const PORT = 4723;
const config = {
  platformName: 'Android',
  deviceName: 'emulator-5554',
  app: 'C:\\Users\\Trevor\\Downloads\\--e0a182fb6c97450cb4ec72ec2ec9d85e-signed.apk', // relative to root of project
  automationName: 'UiAutomator2',
  appWaitForLaunch: false
};
const driver = wd.promiseChainRemote('localhost', PORT);

beforeAll(async () => {
  await driver.init(config);
  console.log('DONE');
  await driver.sleep(58000); // wait for app to load
});

test('searchBar component is the searched element still in searchbar after map view had changed', async () => {
  const TEXT = 'coffee near sgw';
  const element = await driver.elementsByXPath('/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.EditText');
  console.log('AppiumLog-editable searchBar component is present');
  await driver.clickElement(element);
  console.log('AppiumLog-textfield is clickable');
  await driver.type(element, TEXT);
  await driver.pressKeycode(66);
  console.log('AppiumLog-keyboard should dissapear and map should re-render');
  const answer = await driver.textPresent(TEXT, element);
  expect(answer).toBe(true);
});

test('appium has location button', async () => {
  el2 = await driver.elementsByXPath('/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/android.view.ViewGroup/android.view.ViewGroup/android.widget.ImageView');
  expect(el2).toBeDefined();
});
