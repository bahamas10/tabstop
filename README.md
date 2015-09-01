ts(1) - Tab Stop Manager for Vim
================================

Manage tab stop styles in Vim.  Used for switching between X number of spaces
and hard tabs for different file types.

Getting Started
---------------

`ts` works by managing a file in your home directory named `~/.vimrc.indent`.
To enable `ts` just add the following lines to your `.vimrc` file.

``` vimrc
if filereadable(expand("~/.vimrc.indent"))
    source ~/.vimrc.indent
endif
```

Now, the `ts` command can be used to see what rules are set

    $ ts
    $

As you can see, because the file doesn't exist yet there are no rules,
so let's create some.

    ts ruby 2
    ts javascript 2
    ts python 4
    ts c tabs

Then, let's run `ts` to see what we have

    $ ts
    c               tabs
    javascript      2 spaces
    python          4 spaces
    ruby            2 spaces

The underlying file looks like

    $ cat ~/.vimrc.indent
    autocmd FileType javascript setlocal sw=2 sts=2 et
    autocmd FileType python setlocal sw=4 sts=4 et
    autocmd FileType ruby setlocal sw=2 sts=2 et
    autocmd FileType c setlocal sw=8 sts=8 noet

Examples
--------

List all rules

    $ ts
    c               tabs
    javascript      2 spaces
    python          4 spaces
    ruby            2 spaces

View a specific rule

    $ ts javascript
    2 spaces

Or a rule that doesn't exist

    $ ts foobar
    $ echo $?
    1

Delete a rule

    $ ts c
    tabs
    $ ts -d c
    $ ts c
    $ echo $?
    1

Install
-------

You can place the `ts` command anywhere in your `$PATH` to run it as a standalone script,
or source it from your `.bashrc` file to use it as a function.

Optionally, use [Bics](https://github.com/bahamas10/bics) to manage this plugin

    bics install git://github.com/bahamas10/tabstop.git

License
-------

MIT License
