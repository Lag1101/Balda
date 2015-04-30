#include "Node.h"

#include <iostream>
#include <functional>
#include <algorithm>
#include <fstream>
#include <iterator>
#include <string>

void Node::add(const std::wstring & word, size_t letterNumber)
{
	if( word.length() <= letterNumber )
	{
		nodes.insert(std::make_pair(end, Node()));
		return;
	}

	char letter = word[letterNumber];

	Node & node = nodes[letter];

	node.add(word, letterNumber+1);
}

bool Node::exist(const std::wstring & word, size_t letterNumber) const
{
	if( word.length() <= letterNumber  ) 
	{
		return nodes.find(end) != nodes.end();
	}
	char letter = word[letterNumber];

	nodes_t::const_iterator nodeIt = nodes.find(letter);

	if( nodeIt == nodes.end()  ) 
	{
		return false;
	}

	return nodeIt->second.exist( word, letterNumber+1 );
}

void Node::clear()
{
	nodes.clear();
}