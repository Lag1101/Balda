{
  "targets": [
    {
      "target_name": "WordTree",
      "sources": [ "cpp/addon.cc", "cpp/Node.cpp", "cpp/WordTree.cpp" ],
      "include_dirs": [
        "<!(node -e \"require('nan')\")",
        "./cpp"
      ],
      'cflags': [
        '/openmp'
      ]
    }
  ]
}