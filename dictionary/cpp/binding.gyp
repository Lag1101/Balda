{
  "targets": [
    {
      "target_name": "WordTree",
      "sources": [ "addon.cc", "Node.cpp", "WordTree.cpp" ],
      "include_dirs": [
        "<!(node -e \"require('nan')\")"
      ]
    }
  ]
}