const inquirer = require('inquirer');
const fs = require('fs');
const chalk = require('chalk');
const Promise = require('bluebird');
const ora = require('ora');

const download = Promise.promisify(require('download-git-repo'));
const spinner = ora('正在下载模板...');

const inquirerFn = () => {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: '请输入项目名称：'
        },
        {
            type: 'input',
            name: 'description',
            message: '请输入项目简介：'
        }
    ])
};

/**
 * 从github上下载已有的模版
 */
const downloadFn = (answers,dirname) => {
    const { name = dirname, description = dirname } = answers;
    let url = 'https://github.com/bons-blog/vite-blog.git';
    spinner.start();
    download(url, dirname, { clone: false })
        .then(() => {
            spinner.stop(); // 关闭loading动效
            console.log(chalk.green('download template success'));
            // 重写package中的name、description等项目信息
            const pkg = process.cwd() + `/${dirname}/package.json`;
            const content = JSON.parse(fs.readFileSync(pkg, 'utf8'));
            content.name = name;
            content.description = description;
            const result = JSON.stringify(content);
            fs.writeFileSync(pkg, result);
        })
        .catch(err => {
            spinner.stop(); // 关闭loading动效
            console.log(chalk.red('download template failed'));
            console.log(err);
        });
}


module.exports = {
    inquirerFn,
    downloadFn
};