const Page = require('./page')

class DashboardPage extends Page {

    get menuUserManagement(){
        return $('//*[contains(@class, "icon-user3")]');
    }

    get menuActivityLog(){
        return $('//*[contains(text(), "Activity Log")]');
    }

    get menuDevices(){
        return $('//*[contains(@class, "icon-device")]');
    }

    get activityLogSelectDate(){
        return $('//*[contains(@placeholder, "Select Date")]')
    }

    get buttonExport(){
        return $('//*[contains(text(), "Export")]');
    }

    async clickMenuUserManagement(){
        await this.menuUserManagement.waitForClickable();
        await this.menuUserManagement.click();
    }

    async clickMenuActivityLog(){
        await this.menuActivityLog.waitForClickable();
        await this.menuActivityLog.click();
    }

    async clickMenuDevices(){
        await this.menuDevices.waitForClickable();
        await this.menuDevices.click();
    }

    async selectDate(dateValue){
        let datePicker = $(`//*[contains(@class, "el-date-table-cell__text") and contains(text(), "${dateValue}")]`);
        await this.activityLogSelectDate.waitForClickable();
        await this.activityLogSelectDate.click();
        await datePicker.waitForClickable();
        await datePicker.click();
    }

    async exportFile(){
        await this.buttonExport.waitForClickable();
        await this.buttonExport.click();
        await browser.pause(20000);
    }

}

module.exports = new DashboardPage();