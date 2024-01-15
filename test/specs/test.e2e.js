const { expect } = require('@wdio/globals')
const fs = require('fs')
const Client = require('ssh2-sftp-client')
const dashboardPage = require('../pageobjects/dashboard.page')
const loginPage = require('../pageobjects/login.page')

const filePath = "./downloads";

describe('Download log from dashboard and send via sftp', () => {

    beforeEach(async() => {
        await loginPage.open()
        await loginPage.login('admin', 'admin');
        await browser.pause(2000);
    })

    it('Download activity log yesterday', async () => {
        var yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        console.log("Yesterday:" + yesterday.getDate());
        await dashboardPage.clickMenuUserManagement();
        await dashboardPage.clickMenuActivityLog();
        await dashboardPage.selectDate(yesterday.getDate());
        await dashboardPage.exportFile();
        await browser.pause(2000);
    })

    it('Download devices log', async () => {
        await dashboardPage.clickMenuDevices();
        await browser.pause(5000);
        await dashboardPage.exportFile();
        await browser.pause(2000);
    })

    it('Send file via sftp', async () => {
        //Code to send file via sftp
        let sftp = new Client();

        var fileNames = [];
        fs.readdirSync(filePath).forEach(file => {
        console.log('List file ' + file);
        fileNames.push(file);
        });

        await sftp.connect({
            host: 'host',
            port: 22,
            username: 'username',
            password: 'password',
        }).then(async () => {
            for(i=0; i<fileNames.length; i++){
                try {
                    await sftp.put(require('path').join(__dirname, `../../downloads/${fileNames[i]}`), `/home/beps/otp/${fileNames[i]}`, false);
                    console.log('Send file ' + fileNames[i] + ' success!')
                } catch (error) {
                    console.log(error, 'Send file ' + fileNames[i] + ' failed')
                }
            }
        }).then(async response => {
            console.log(response, 'the data info');
        }).catch(async err => {
            console.log(err, 'catch error');
        })
    })

    after(async () => {
        // Code to delete the download folder
        const deleteFolderRecursive = async (path) => {
            if (fs.existsSync(path)) {
                for (let file of fs.readdirSync(path)) {
                    const curPath = `${path}/${file}`;
                    if (fs.lstatSync(curPath).isDirectory()) {
                        await deleteFolderRecursive(curPath);
                    } else {
                        fs.unlinkSync(curPath);
                    }
                }
                fs.rmdirSync(path);
            }
        };

        await deleteFolderRecursive(filePath);
    });
})

