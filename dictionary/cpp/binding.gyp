{
  "targets": [
    {
      "target_name": "WordTree",
      "sources": [ "addon.cc", "WordTree.cpp" ],
      "include_dirs": [
        "<!(node -e \"require('nan')\")"
      ]
    }
  ]
}