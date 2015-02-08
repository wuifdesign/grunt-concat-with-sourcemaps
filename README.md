grunt-concat-with-sourcemaps
======================

> Concatenate files and combine their source maps into one file

Getting Started
------------------

This plugin requires Grunt `~0.4.2`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-concat-with-sourcemaps --save-dev
```

One the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-concat-with-sourcemaps');
```

The "concat_with_sourcemaps" task
---------------------------

### Overview
In your project's Gruntfile, add a section named `concat_with_sourcemaps` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  concat_with_sourcemaps: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      files: {
        'path-to-output/output.js': ['path-to-input/**/*.js']
        // Add as many files you like
      }
    }
  }
})
```

### Merging source map files

If input file has source map linkage (e.g. `//# sourceMappingURL=.*`), grunt-concat-with-sourcemaps will parse the source map
and create a new source map including those file.

Options
------------------------

#### options.separator

Type: `String`
Default value: `grunt.util.linefeed`

The value that will be used to separate lines when combining files.

#### options.sourceRoot

Type: `String`
Default value: `''`

Root for all relative URLs in the source map. (Optional)

#### options.includeSourcesContent

Type: `Boolean`
Default value: `false`

If set to true, the content of the sources will be added to the source maps. This is used, if you don't want to upload your
source files. (Optional)

Example
------------------------

This example uses [grunt-contrib-coffee](https://github.com/gruntjs/grunt-contrib-coffee) and
[grunt-contrib-uglify](https://github.com/gruntjs/grunt-contrib-uglify).

```
grunt.initConfig({
  coffee: {
    task_name: {
      options: {
        sourceMap: true
      },
      expand: true,
      flatten: false,
      cwd: 'coffee',
      src: ['**/*.coffee'],
      dest: './src',
      ext: '.js'
    }
  },
  concat_with_sourcemaps: {
    task_name: {
      files: {
        'dist/output.js': ['src/*.js']
      }
    }
  },
  uglify: {
    task_name: {
      options: {
        sourceMap: true,
        sourceMapIn: 'dist/output.js.map'
      },
      files: {
        'dist/output.min.js': ['dist/output.js']
      }
    }
  }
})
```

The generated source map will refer to the original coffee script source files:

```
{
  "version": 3,
  "file": "output.min.js",
  "sources": [
    "src/file-1.coffee",
    "src/file-2.coffee"
  ],
  "names": [],
  "mappings": "..."
}
```